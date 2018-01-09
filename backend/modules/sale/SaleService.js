const { execRedis } = require('../../lib/utils')
const Boom = require('boom')

let ObjectId

class SaleService {
  constructor ({
    saleCollection,
    affilatedCollection,
    userClient,
    redis,
    mongo
  }) {
    this.saleCollection = saleCollection
    this.affilatedCollection = affilatedCollection
    this.userClient = userClient
    this.redis = redis
    ObjectId = mongo.ObjectId
  }

  async shipTokens (tx, req, reply) {
    // complete transaction
    const { userId, txId, currency, btcAmount } = tx
    // TODO: get price
    const tokensAmount = btcAmount * 50000
    await execRedis(this.redis, 'zadd', [`sale:${userId}:tokens:all`, tokensAmount, txId])

    if (req.status >= 100) {
      await execRedis(this.redis, 'zadd', [`sale:${userId}:tokens:confirmed`, tokensAmount, txId])
    } else {
      await execRedis(this.redis, 'zadd', [`sale:${userId}:tokens:pending`, tokensAmount, txId])
    }

    await this.saleCollection.updateOne({ txId }, {
      userId: ObjectId.createFromHexString(userId),
      txId,
      currency,
      btcAmount,
      tokensAmount,
      updateAt: Math.trunc(new Date().getTime() / 1000)
    }, { upsert: true })
  }

  async getBalance (type, req, reply) {
    const user = await this.userClient.getUser(req)
    const tx = await execRedis(this.redis, 'zrange', [`sale:${user._id}:tokens:${type}`, 0, -1, 'WITHSCORES'])

    return tx
      .filter((_, index) => index % 2 === 1)
      .map(value => parseFloat(value))
      .reduce((acc, current) => {
        acc += current
        return acc
      }, 0)
  }
  
  async getProgress (req, reply) {
    const sold = Math.random() * 10 * 1e6
    const raised = sold / 50000
    return {
      sold,
      raised
    }
  }

  async getInfo (req, reply) {
    return {
      endTime: new Date(Date.UTC(2018, 1, 8, 0, 0, 0, 0)),
      startTime: new Date(Date.UTC(2018, 0, 8, 0, 0, 0, 0)),
      hardCap: 50 * 1e6,
      softCap: 10 * 1e6,
      priceBTC: 1 / 50000
    }
  }
}

module.exports = SaleService