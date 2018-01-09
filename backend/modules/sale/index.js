const fp = require('fastify-plugin')
const ws = require('../../lib/fastify-ws')
const crypto = require('crypto')
const qs = require('querystring')
const Boom = require('boom')

function makeSignature(parameters, secret) {
  const paramString = qs.stringify(parameters).replace(/%20/g, '+')
  const signature = crypto.createHmac('sha512', secret).update(paramString).digest('hex')
  return signature
}

module.exports = async function (fastify, opts) {
  // This is a plugin registration inside a plugin
  // fastify-env checks and coerces `opts` and save the result in `fastify.config`
  // See https://github.com/fastify/fastify-env
  fastify.register(require('fastify-env'), {
    schema: {
      type: 'object',
      required: [ 
        'SALE_MONGO_URL',
        'SALE_REDIS_URL',
        'SALE_SERVICE_SECRET',
        'USER_SERVICE_URL',
        'PAYMENTS_SERVICE_URL'
      ],
      properties: {
        SALE_MONGO_URL: { type: 'string' },
        SALE_REDIS_URL: { type: 'string' },
        SALE_SERVICE_SECRET: { type: 'string' },
        USER_SERVICE_URL: { type: 'string' },
        PAYMENTS_SERVICE_URL: { type: 'string' }
      }
    },
    data: opts
  })

  fastify.register(async function (fastify) {
    // We need a connection database:
    // `fastify-mongodb` makes this connection and store the database instance into `fastify.mongo.db`
    // See https://github.com/fastify/fastify-mongodb
    fastify.register(require('fastify-mongodb'), {
      url: fastify.config.SALE_MONGO_URL
    })
    
    fastify.register(require('fastify-redis'), {
      url: fastify.config.SALE_REDIS_URL
    })

    // Create our business login object and store it in fastify instance
    // Because we need `paymentsCollection` *after* (and not only in) this plugin,
    // we need to use `fastify-plugin` to ask to `fastify` don't encapsulate `decorateWithpaymentsCollection`
    // but to share the same fastify instance between inside and outside.
    // In this way all decorations are available outside too.
    fastify.register(fp(async function decorateWithCollections (fastify, opts) {
      fastify.decorate('saleCollection', fastify.mongo.db.collection('sale'))
      fastify.decorate('affilatedCollection', fastify.mongo.db.collection('affilated'))
    }))

    // Each plugin is standalone, so the database shoud be set up
    // Mongodb has no schema but we need to specify some indexes and validators
    fastify.register(async function (fastify, opts) {
      require('./mongoCollectionSetup')(fastify.mongo.db, fastify.affilatedCollection, fastify.saleCollection)
    })

    fastify.register(require('../../clients/user'), fastify.config)

    fastify.register(fp(async function (fastify, opts) {
      const SaleService = require('./SaleService.js')
      const saleService = new SaleService(fastify)
      fastify.decorate('saleService', saleService)
    }))

    fastify.register(registerRoutes)
  }) 
}

async function registerRoutes (fastify, opts) {
  fastify.post('/notifyTransaction', async (req, reply) => {
    const hmac = makeSignature(req.body, fastify.config.SALE_SERVICE_SECRET)
    
    if (hmac !== req.headers.hmac) {
      return Boom.forbidden('Incorrect message signature')
    }

    return await fastify.saleService.shipTokens(req.body, req, reply)
  })

  fastify.get('/info', async (req, reply) => {
    return await fastify.saleService.getInfo(req, reply)
  })

  fastify.get('/progress', async (req, reply) => {
    return await fastify.saleService.getProgress(req, reply)
  })

  fastify.get('/affilated', async (req, reply) => {
    return await fastify.saleService.getAffilated(req, reply)
  })

  fastify.get('/inviteCode', async (req, reply) => {
    return await fastify.saleService.getInviteCode(req, reply)
  })

  fastify.get('/balance/:type', async (req, reply) => {
    return await fastify.saleService.getBalance(req.params.type, req, reply)
  })
}