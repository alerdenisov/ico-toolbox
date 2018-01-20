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
      logs,
      mongo, 
      redis } = fastify
    this.paymentsCollection = paymentsCollection
    this.walletsCollection = walletsCollection
    this.logs = logs
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
    if (!user) {
      return Boom.badRequest('Authenticated data not provided')
    }
    return await execRedis(this.redis, 'get', [`payments:${user._id}:${currency}`])
  }

  async createWallet(currency, req, reply) {
    const user = await this.userClient.getUser(req)
    if (!user) {
      return Boom.badRequest('Authenticated data not provided')
    }

    const rates = await this.getRates(req, reply)
    if (!rates[currency] || rates[currency].status !== 'online' || rates[currency].accepted !== 1) {
      return Boom.badRequest('Target currency isn\'t accepting')
    }

    let wallet = await this.getCallbackAddress(currency)

    // store current rate in wallet record
    wallet.rate_btc = parseFloat(rates[currency].rate_btc)
    wallet.expireAt = (new Date().getTime() / 1000) + (60 * 180)

    // Set lifetime of wallet on 1 hour
    await execRedis(this.redis, 'set', [`payments:${user._id}:${currency}`, JSON.stringify(wallet), 'EX', 60 * 180])

    // Store user generated wallet forever (just for case if someone will send money after expired time) 
    await execRedis(this.redis, 'set', [`payments:wallets:${wallet.address}`, user._id])


    this.logs.send({
      sender: 'payments',
      message: 'create-wallet',
      args: {
        currency,
        wallet,
        user
      }
    })

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
    return userTxs
  }

  async getTransactions(req, reply) {
    return await this.paymentsCollection.find({}).limit(25).toArray()
  }

  async transactionEvent(event, req, reply) {
    let { status, txn_id, address, amount, currency, datetime } = event
    status = parseInt(status)
    amount = parseFloat(amount)

    datetime = datetime || Math.trunc(new Date().getTime() / 1000)

    const isFailed = status < 0
    const isPending = !isFailed && status < 100
    const isComplete = status === 100

    const userIdRaw = await execRedis(this.redis, 'get', [`payments:wallets:${address}`])
    let userId = userIdRaw ? ObjectId.createFromHexString(userIdRaw) : null

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

    await execRedis(this.redis, 'zadd', [`payments:transactions`, datetime, txn_id])
    await execRedis(this.redis, 'zadd', [`payments:transactions:${userId}`, datetime, txn_id])
    await execRedis(this.redis, 'set', [`payments:transaction:${txn_id}`, JSON.stringify(transaction)])

    if (userId) {
      transaction.userId = transaction.userId.toString()
    }
    
    if (status >= 100) {
      this.saleClient.notifyTransaction(transaction)
    }
    this.logs.send({
      sender: 'payments',
      message: 'ipn',
      args: transaction
    })
    return transaction
  }
}

module.exports = PaymentsService
