const ws = require('../../lib/fastify-ws')
const fp = require('fastify-plugin')
const qs = require('querystring')
const crypto = require('crypto')
const { promisify } = require('util')
const boom = require('boom')

module.exports = async function (fastify, opts) {
  // This is a plugin registration inside a plugin
  // fastify-env checks and coerces `opts` and save the result in `fastify.config`
  // See https://github.com/fastify/fastify-env
  fastify.register(require('fastify-env'), {
    schema: {
      type: 'object',
      required: [ 
        'PAYMENTS_MONGO_URL',
        'PAYMENTS_REDIS_URL',
        'USER_SERVICE_URL',
        'SALE_SERVICE_URL',
        'SALE_SERVICE_SECRET',
        'COINPAYMENTS_PRIVATE_KEY',
        'COINPAYMENTS_PUBLIC_KEY',
        'COINPAYMENTS_IPN', 
        'COINPAYMENTS_IPN_TIME',
      ],
      properties: {
        PAYMENTS_MONGO_URL: { type: 'string' },
        PAYMENTS_REDIS_URL: { type: 'string' },
        USER_SERVICE_URL: { type: 'string' },
        SALE_SERVICE_URL: { type: 'string' },
        SALE_SERVICE_SECRET: { type: 'string' },
        COINPAYMENTS_PRIVATE_KEY: { type: 'string' },
        COINPAYMENTS_PUBLIC_KEY: { type: 'string' },
        COINPAYMENTS_IPN: { type: 'boolean' },
        COINPAYMENTS_IPN_TIME: { type: 'integer' }
      }
    },
    data: opts
  })

  fastify.register(require('fastify-formbody'))
  
  fastify.register(async function (fastify, opts) {
    fastify.register(require('../../lib/fastify-coinpayments'), {
      COINPAYMENTS_PRIVATE_KEY: fastify.config.COINPAYMENTS_PRIVATE_KEY,
      COINPAYMENTS_PUBLIC_KEY: fastify.config.COINPAYMENTS_PUBLIC_KEY,
      COINPAYMENTS_IPN: fastify.config.COINPAYMENTS_IPN, 
      COINPAYMENTS_IPN_TIME: fastify.config.COINPAYMENTS_IPN_TIME,
    })
    // We need a connection database:
    // `fastify-mongodb` makes this connection and store the database instance into `fastify.mongo.db`
    // See https://github.com/fastify/fastify-mongodb
    fastify.register(require('fastify-mongodb'), {
      url: fastify.config.PAYMENTS_MONGO_URL
    })

    fastify.register(require('fastify-redis'), {
      url: fastify.config.PAYMENTS_REDIS_URL
    })

    // Create our business login object and store it in fastify instance
    // Because we need `paymentsCollection` *after* (and not only in) this plugin,
    // we need to use `fastify-plugin` to ask to `fastify` don't encapsulate `decorateWithpaymentsCollection`
    // but to share the same fastify instance between inside and outside.
    // In this way all decorations are available outside too.
    fastify.register(fp(async function decorateWithCollections (fastify, opts) {
      fastify.decorate('paymentsCollection', fastify.mongo.db.collection('payments'))
      fastify.decorate('walletsCollection', fastify.mongo.db.collection('wallets'))
    }))

    // Each plugin is standalone, so the database shoud be set up
    // Mongodb has no schema but we need to specify some indexes and validators
    fastify.register(async function (fastify, opts) {
      require('./mongoCollectionSetup')(fastify.mongo.db, fastify.paymentsCollection, fastify.walletsCollection)
    })

    fastify.register(require('../../clients/user'), fastify.config)
    fastify.register(require('../../clients/sale'), fastify.config)

    // Add another business logic object to `fastify` instance
    // Again, `fastify-plugin` is used in order to access to `fastify.userService` from outside
    fastify.register(fp(async function (fastify, opts) {
      const PaymentsService = require('./PaymentsService.js')
      const paymentsService = new PaymentsService(fastify)
      fastify.decorate('paymentsService', paymentsService)
    }))

    fastify.register(registerRoutes)
  })
  
}

async function registerRoutes (fastify, opts) {
  // fastify.get('/me', async (req, reply) => {
  //   const profile = await fastify.auth0.profile(req.headers.authorization)
  //   await fastify.userService.updateProfile(profile)
  //   return await fastify.userService.getProfile(profile.sub)
  // })
  const { COINPAYMENTS_PRIVATE_KEY, COINPAYMENTS_PUBLIC_KEY } = fastify.config

  fastify.use(require('../../lib/debug-response')('payments'))

  fastify.get('/wallet/:currency', async (req, reply) => {
    return fastify.paymentsService.getWallet(req.params.currency, req, reply)
  })

  fastify.get('/wallet/:currency/create', async (req, reply) => {
    return fastify.paymentsService.createWallet(req.params.currency, req, reply)
  })

  fastify.get('/transactions/my', async (req, reply) => {
    return fastify.paymentsService.getUserTransactions(req, reply)
  })

  fastify.get('/transactions', async (req, reply) => {
    return fastify.paymentsService.getTransactions(req, reply)
  })

  fastify.get('/testtx', async (req, reply) => {
    return new Promise((resolve, reject) => {
      fastify.coinPayments.api.getTxList((err, result) => {
        if (err) {
          console.log(err)
          return reject(err)
        }
        console.log(result)
        return resolve(result)
      })
    })
  })

  fastify.get('/rates', async (req, reply) => {
    return fastify.paymentsService.getRates(req, reply)
  })

  fastify.post('/ipn', async function (req, reply) {
    console.log('------------------------------ipn--------------------------------------')
    console.log(req.headers)
    console.log(req.body)
    console.log('------------------------------ipn--------------------------------------')
    if ( !COINPAYMENTS_PRIVATE_KEY || !COINPAYMENTS_PUBLIC_KEY ) {
      throw 'Merchant ID and Merchant Secret are needed'
    }

    const getPrivateHeadersIPN = function getPrivateHeadersIPN(parameters) {
      const paramString = qs.stringify(parameters).replace(/%20/g, '+')
      const signature = crypto.createHmac('sha512', COINPAYMENTS_PRIVATE_KEY).update(paramString).digest('hex')
      return signature
    }

    if (!req.headers.hmac || !req.body || !req.body.ipn_mode || req.body.ipn_mode != 'hmac' || COINPAYMENTS_PUBLIC_KEY != req.body.merchant) {
      return boom.badRequest(JSON.stringify({
        message: 'Coinpayments Invalid Request',
        hmac: !req.headers.hmac,
        body: !req.body,
        ipn_mode: !req.body.ipn_mode,
        right_mode: req.body.ipn_mode != 'hmac',
        pubkey: COINPAYMENTS_PUBLIC_KEY != req.body.merchant
      }))
    }

    const hmac = getPrivateHeadersIPN(req.body)
    if (hmac != req.headers.hmac) {
      return boom.badRequest(`Coinpayments Invalid Request`)
    }

    reply.code(204).header('Content-Type', 'application/json').send()
    await fastify.paymentsService.transactionEvent(req.body, req, reply)
  })
}