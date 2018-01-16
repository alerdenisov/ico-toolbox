'use strict'

const assert = require('assert')
const fp = require('fastify-plugin')
const got = require('got')
const crypto = require('crypto')
const qs = require('querystring')

function makeSignature(parameters, secret) {
  const paramString = qs.stringify(parameters).replace(/%20/g, '+')
  console.log('make sig for', paramString, secret)
  const signature = crypto.createHmac('sha512', secret).update(paramString).digest('hex')
  return signature
}

module.exports = fp(async function (fastify, opts) {
  assert.ok(opts.LOGS_SERVICE_URL, '"LOGS_SERVICE_URL" must be a string')
  assert.ok(opts.LOGS_SERVICE_SECRET, '"LOGS_SERVICE_SECRET" must be a string')

  fastify.decorate('logs', {
    send: function (message) {
      return got(`${opts.LOGS_SERVICE_URL}/send`, {
        method: 'POST',
        body: message,
        headers: {
          hmac: makeSignature(message, opts.LOGS_SERVICE_SECRET)
        },
        json: true,
        followRedirect: false
      }).then(r => r.body)
    }
  })
})
