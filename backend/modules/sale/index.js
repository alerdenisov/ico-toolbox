const fp = require('fastify-plugin')
const ws = require('../../lib/fastify-ws')
const crypto = require('crypto')
const qs = require('querystring')
const Boom = require('boom')

function makeSignature(parameters, secret) {
  const paramString = qs.stringify(parameters).replace(/%20/g, '+')
  console.log('check sig for', paramString, secret)
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
        SALE_MONGO_URL: { type: 'string', default: 'mongodb://localhost/sale' },
        SALE_REDIS_URL: { type: 'string', default: 'redis://127.0.0.1:6379' },
        SALE_SERVICE_SECRET: { type: 'string', default: 'test' },
        USER_SERVICE_URL: { type: 'string', default: 'http://localhost:3000/api/user' },
        PAYMENTS_SERVICE_URL: { type: 'string', default: 'http://localhost:3000/api/payments' }
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

    // TODO: ship tokens
  })

  fastify.get('/info', async (req, reply) => {
    return await fastify.saleService.getInfo(req, reply)
  })

  fastify.get('/progress', async (req, reply) => {
    return await fastify.saleService.getProgress(req, reply)
  })
}