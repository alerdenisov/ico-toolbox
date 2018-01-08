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
  assert.ok(opts.SALE_SERVICE_URL, '"SALE_SERVICE_URL" must be a string')
  assert.ok(opts.SALE_SERVICE_SECRET, '"SALE_SERVICE_SECRET" must be a string')

  fastify.decorate('saleClient', {
    notifyTransaction: function (transaction) {
      return got(`${opts.SALE_SERVICE_URL}/notifyTransaction`, {
        method: 'POST',
        body: transaction,
        headers: {
          hmac: makeSignature(transaction, opts.SALE_SERVICE_SECRET)
        },
        json: true,
        followRedirect: false
      }).then(r => r.body)
    }
  })
})
