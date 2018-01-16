const fp = require('fastify-plugin')

module.exports = async function (fastify, opts) {
  // This is a plugin registration inside a plugin
  // fastify-env checks and coerces `opts` and save the result in `fastify.config`
  // See https://github.com/fastify/fastify-env
  fastify.register(require('fastify-env'), {
    schema: {
      type: 'object',
      required: [ 
        'USER_MONGO_URL',
        'USER_REDIS_URL',
        'AUTH0_DOMAIN',
        'AUTH0_CLIENT_ID',
        'AUTH0_CLIENT_SECRET',
        'LOGS_SERVICE_URL'
      ],
      properties: {
        USER_MONGO_URL: { type: 'string' },
        USER_REDIS_URL: { type: 'string' },
        AUTH0_DOMAIN: { type: 'string' },
        AUTH0_CLIENT_ID: { type: 'string' },
        AUTH0_CLIENT_SECRET: { type: 'string' },
        LOGS_SERVICE_URL: { type: 'string' }
      }
    },
    data: opts
  })

  fastify.register(async function (fastify, opts) {
    fastify.register(require('../../lib/fastify-auth0'), {
      AUTH0_DOMAIN: fastify.config.AUTH0_DOMAIN,
      AUTH0_CLIENT_ID: fastify.config.AUTH0_CLIENT_ID,
      AUTH0_CLIENT_SECRET: fastify.config.AUTH0_CLIENT_SECRET
    })
    // We need a connection database:
    // `fastify-mongodb` makes this connection and store the database instance into `fastify.mongo.db`
    // See https://github.com/fastify/fastify-mongodb
    fastify.register(require('fastify-mongodb'), {
      url: fastify.config.USER_MONGO_URL
    })

    fastify.register(require('fastify-redis'), {
      url: fastify.config.USER_REDIS_URL
    })

    // Create our business login object and store it in fastify instance
    // Because we need `userCollection` *after* (and not only in) this plugin,
    // we need to use `fastify-plugin` to ask to `fastify` don't encapsulate `decorateWithUserCollection`
    // but to share the same fastify instance between inside and outside.
    // In this way all decorations are available outside too.
    fastify.register(fp(async function decorateWithUserCollection (fastify, opts) {
      fastify.decorate('userCollection', fastify.mongo.db.collection('users'))
    }))

    // Each plugin is standalone, so the database shoud be set up
    // Mongodb has no schema but we need to specify some indexes and validators
    fastify.register(async function (fastify, opts) {
      require('./mongoCollectionSetup')(fastify.mongo.db, fastify.userCollection)
    })

    // Add another business logic object to `fastify` instance
    // Again, `fastify-plugin` is used in order to access to `fastify.userService` from outside
    fastify.register(fp(async function (fastify, opts) {
      const UserService = require('./UserService.js')
      const userService = new UserService(fastify)
      fastify.decorate('userService', userService)
    }))

    fastify.register(registerRoutes)
  })
}

async function registerRoutes (fastify, opts) {
  fastify.use(require('../../lib/debug-response')('user'))

  fastify.get('/login', async (req, reply) => {
    const token = req.headers.authorization
    const profile = await fastify.auth0.profile(req.headers.authorization)
    console.log(profile)

    this.logs.send({
      sender: 'user',
      message: 'login',
      args: {
        profile,
        token
      }
    })

    await fastify.userService.updateProfile(profile, token)
    return await fastify.userService.getProfile(token)
  })

  fastify.get('/me', async (req, reply) => {
    const token = req.headers.authorization
    const profile = await fastify.userService.getProfile(token)
    
    this.logs.send({
      sender: 'user',
      message: 'me',
      args: {
        profile,
        token
      }
    })

    return profile
  })
}