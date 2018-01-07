'use strict'

const assert = require('assert')
const fp = require('fastify-plugin')
const got = require('got')

module.exports = fp(async function (fastify, opts) {
  assert.ok(opts.USER_SERVICE_URL, '"USER_SERVICE_URL" must be a string')

  fastify.decorate('userClient', {
    getUser: function (req) {
      if (!req.headers.authorization) {
        return Promise.reject(new Error('No authorization header found'))
      }

      return got(`${opts.USER_SERVICE_URL}/me`, {
        method: 'GET',
        headers: {
          authorization: req.headers.authorization
        },
        json: true,
        followRedirect: false
      }).then(r => r.body)
    }
  })
})
