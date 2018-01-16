const fp = require('fastify-plugin')
const crypto = require('crypto')
const qs = require('querystring')
const { execRedis } = require('../../lib/utils')

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
        'LOGS_SERVICE_SECRET',
        'LOGS_REDIS_URL',
        'USER_SERVICE_URL'
      ],
      properties: {
        LOGS_SERVICE_SECRET: { type: 'string' },
        LOGS_REDIS_URL: { type: 'string' },
        USER_SERVICE_URL: { type: 'string' },
      }
    },
    data: opts
  })

  fastify.register(async function (fastify, opts) {
    fastify.register(require('fastify-redis'), {
      url: fastify.config.LOGS_REDIS_URL
    })
    fastify.register(require('../../clients/user'), fastify.config)
    fastify.register(registerRoutes)
  })
}

async function registerRoutes (fastify, opts) {
  fastify.use(require('../../lib/debug-response')('logs'))

  fastify.post('/send', async (req, reply) => {
    const hmac = makeSignature(req.body, fastify.config.LOGS_SERVICE_SECRET)
    if (hmac !== req.headers.hmac) {
      return Boom.forbidden('Incorrect message signature')
    }

    // write message to redis
    await execRedis(fastify.redis, 'zadd', [`logs`, new Date().getTime(), JSON.stringify(req.body)])
  })

  fastify.get('/logs', async (req, reply) => {
    const user = await fastify.userClient.getUser(req)
    if (user.roles.indexOf('admin') === -1) {
      return Boom.forbidden('Not enough permissions')
    }

    const raw = await execRedis(fastify.redis, 'zrevrange', ['logs', 0, -1, 'WITHSCORES'])
    const result = []
    console.log(raw)
    for (let index = 0; index < raw.length; index += 2) {
      result.push({
        ...JSON.parse(raw[index]),
        date: parseInt(raw[index + 1])
      })
    }

    return result
  })
}