'use strict'
const axios = require('axios')
const fp = require('fastify-plugin')
const util = require('util')
const Coinpayments = require('coinpayments')

module.exports = fp(async function (fastify, opts) {
  const instance = new Coinpayments({
    key: opts.COINPAYMENTS_PUBLIC_KEY,
    secret: opts.COINPAYMENTS_PRIVATE_KEY,
    autoIpn: opts.COINPAYMENTS_IPN,
    ipnTime: opts.COINPAYMENTS_IPN_TIME
  })

  fastify.decorate('coinPayments', {
    api: instance,
    ipn: Coinpayments.ipn({
      'merchantId': opts.COINPAYMENTS_PUBLIC_KEY,
      'merchantSecret': opts.COINPAYMENTS_PRIVATE_KEY
    })
  })
}, '>=0.0.1')
