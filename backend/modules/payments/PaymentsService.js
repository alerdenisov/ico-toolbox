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
      saleClient,
      coinPayments,
      mongo, 
      redis } = fastify
    this.paymentsCollection = paymentsCollection
    this.walletsCollection = walletsCollection
    this.redis = redis
    this.coinPayments = coinPayments
    this.userClient = userClient
    this.saleClient = saleClient
    ObjectId = mongo.ObjectId
  }

  async getCallbackAddress(currency, req, reply) {
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
    return await execRedis(this.redis, 'get', [`payments:${user._id}:${currency}`])
  }

  async createWallet(currency, req, reply) {
    const user = await this.userClient.getUser(req)
    const rates = await this.getRates(req, reply)

    if (!rates[currency] || rates[currency].status !== 'online' || rates[currency].accepted !== 1) {
      return Boom.badRequest('Target currency isn\'t accepting')
    }

    let wallet = await this.getCallbackAddress(currency)

    // store current rate in wallet record
    wallet.rate_btc = parseFloat(rates[currency].rate_btc)
    wallet.expireAt = (new Date().getTime() / 1000) + (60 * 60)

    // Set lifetime of wallet on 1 hour
    await execRedis(this.redis, 'set', [`payments:${user._id}:${currency}`, JSON.stringify(wallet), 'EX', 60 * 60])

    // Store user generated wallet forever (just for case if someone will send money after expired time) 
    await execRedis(this.redis, 'set', [`payments:wallets:${wallet.address}`, user._id])

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

  async getUserTransactions(req, reply) {
    const user = await this.userClient.getUser(req)
    const userTxs = await this.paymentsCollection.find({ userId: ObjectId.createFromHexString(user._id) }).toArray()
    console.log(userTxs)
    return userTxs
  }

  async getTransactions(req, reply) {
    return await this.paymentsCollection.find({}).limit(100).toArray()
  }

  async transactionEvent(event, req, reply) {
    const { status, txn_id, address, amount, currency } = event
    const isFailed = status < 0
    const isPending = !isFailed && status < 100
    const isComplete = status === 100

    const userId = ObjectId.createFromHexString(await execRedis(this.redis, 'get', [`payments:wallets:${address}`]))

    if (!userId) {
      // TODO: save log of unknown user transaction (how it could be possible?)
    }

    const walletData = await execRedis(this.redis, 'get', [`payments:${userId}:${currency}`])
    let btcRate = 0

    if (walletData) {
      btcRate = JSON.parse(walletData).rate_btc
      req.log.info(`found unexpired wallet. Rate is ${btcRate}`)
    } else {
      const rates = await this.getRates(req, reply)
      btcRate = parseFloat(rates[currency].rate_btc)
      req.log.info(`Wallet expired. Current rate is ${btcRate}`)
    }

    const transaction = {
      txId: txn_id,
      currency,
      status,
      address,
      userId,
      btcRate,
      amount,
      btcAmount: amount * btcRate
    }

    // req.log.info('transaction', transaction)
    // console.log(transaction)

    // Dont wait to store finalize
    this.paymentsCollection.updateOne({ txId: txn_id }, transaction, {
      upsert: true
    })

    await execRedis(this.redis, 'zadd', [`payments:transactions`, Date.now(), txn_id])
    await execRedis(this.redis, 'zadd', [`payments:transactions:${userId}`, Date.now(), txn_id])
    await execRedis(this.redis, 'set', [`payments:transaction:${txn_id}`, JSON.stringify(transaction)])

    transaction.userId = transaction.userId.toString()
    await this.saleClient.notifyTransaction(transaction)
    return transaction
  }
}

module.exports = PaymentsService
