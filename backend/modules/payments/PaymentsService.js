'use strict'

const { execRedis } = require('../../lib/utils')
const sha256 = require('node-forge').md.sha256
const Boom = require('boom')
const DUPLICATE_KEY_ERROR_CODE = 11000

let ObjectId

function stringToOjectId (str) {
  if (!ObjectId) {
    throw new Error('Initialize User Service firstly')
  }

  if (typeof str !== 'string') {
    throw new Error('Seed should be a string')
  }

  var hash = sha256.create();
  hash.update(str);
  console.log(hash.digest().toHex().substr(0, 24))
  return new ObjectId(hash.digest().toHex().substr(0, 24));
}


class PaymentsService {
  constructor (fastify) {
    const { 
      paymentsCollection, 
      walletsCollection, 
      userClient,
      coinPayments,
      mongo, 
      redis } = fastify
    this.paymentsCollection = paymentsCollection
    this.walletsCollection = walletsCollection
    this.redis = redis
    this.coinPayments = coinPayments
    this.userClient = userClient
    ObjectId = mongo.ObjectId
  }

  async getCallbackAddress(currency) {
    return new Promise((resolve, reject) => {
      this.coinPayments.api.getCallbackAddress(currency, (err, result) => {
        if (err) {
          return reject(err)
        }
        return resolve(result)
      })
    })
  }

  async getWallet(currency, req, reply) {
    const user = await this.userClient.getUser(req)
    console.log(`payments:${user._id}:${currency}`)
    let wallet = await execRedis(this.redis, 'get', [`payments:${user._id}:${currency}`])
    if(wallet) {
      return wallet
    }
    wallet = JSON.stringify((await this.getCallbackAddress(currency)))
    console.log(wallet)
    await execRedis(this.redis, 'set', [`payments:${user._id}:${currency}`, wallet])

    return wallet
  }

  async getRates(req, reply) {
    return new Promise((resolve, reject) => {
      this.coinPayments.api.rates({
        accepted: 1
      }, (err, result) => {
        if (err) {
          return reject(err)
        }

        return resolve(result)
      })
    })
  }

  async transactionEvent(event) {
    const { status } = event
    const isFailed = status < 0
    const isPending = !isFailed && status < 100
    const isComplete = status === 100

    
  }
}

module.exports = PaymentsService
