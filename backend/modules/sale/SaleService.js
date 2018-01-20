const { execRedis } = require('../../lib/utils')
const Boom = require('boom')
const { forEach } = require('p-iteration')

let ObjectId

class SaleService {
  constructor ({
    saleCollection,
    affilatedCollection,
    userClient,
    logs,
    redis,
    mongo
  }) {
    this.saleCollection = saleCollection
    this.affilatedCollection = affilatedCollection
    this.userClient = userClient
    this.logs = logs
    this.redis = redis
    this.latestUpdate = 0
    ObjectId = mongo.ObjectId

    this.calculateIndexes()
  }

  async calculateIndexes () {
    const userBalances = {}
    await forEach(await this.saleCollection.find({}).toArray(), async tx => {
      userBalances[tx.userId] = userBalances[tx.userId] || {
        tokens: 0,
        contributed: 0
      }

      userBalances[tx.userId].tokens += tx.tokensAmount
      userBalances[tx.userId].contributed += tx.btcAmount
    })

    await forEach(Object.keys(userBalances), async userId => {
      await execRedis(this.redis, `set`, [`sale:${userId}:contributed`, userBalances[userId].contributed])
      await execRedis(this.redis, `set`, [`sale:${userId}:tokens`, userBalances[userId].tokens])
    })

    
    await forEach(Object.keys(userBalances), async userId => {
      let total = 0
      const referrals = (await this.userClient.getReferrals(userId)).body
      await forEach(referrals, async referral => {
        total += parseFloat(referral.contributed)
      })

      console.log(userId, total)

      await execRedis(this.redis, `zadd`, [`sale:referrals`, total, userId])
    })
  }

  async myReferralsTotal (req, reply) {
    const user = await this.userClient.getUser(req)
    return await execRedis(this.redis, 'zscore', [`sale:referrals`, user._id])
  }
  
  async myReferrerRank (req, reply) {
    const user = await this.userClient.getUser(req)
    return await execRedis(this.redis, 'zrevrank', [`sale:referrals`, user._id])
  }

  async shipTokens (tx, req, reply) {
    const { userId, txId, currency, btcAmount, status } = tx
    const tokensAmount = btcAmount * 50000
    await execRedis(this.redis, 'zadd', [`sale:${userId}:tokens:all`, tokensAmount, txId])

    this.logs.send({
      sender: 'sale',
      message: 'transaction',
      args: {
        tx,
        tokensAmount
      }
    })

    if (status >= 100) {
      await execRedis(this.redis, 'zadd', [`sale:${userId}:tokens:confirmed`, tokensAmount, txId])
    } else {
      await execRedis(this.redis, 'zadd', [`sale:${userId}:tokens:pending`, tokensAmount, txId])
    }

    await execRedis(this.redis, `incrbyfloat`, [`sale:${userId}:contributed`, btcAmount])
    await execRedis(this.redis, `incrbyfloat`, [`sale:${userId}:tokens`, tokensAmount])

    if (userId) {
      await this.saleCollection.updateOne({ txId }, {
        userId: ObjectId.createFromHexString(userId),
        txId,
        currency,
        btcAmount,
        tokensAmount,
        status,
        updateAt: Math.trunc(new Date().getTime() / 1000),
      }, { upsert: true })
    }
  }

  async updateTotal (req, reply, force) {
    // if (new Date().getTime() > this.latestUpdate + 1000 * 60 * 60) {
    if (new Date().getTime() > this.latestUpdate) {
      const allTx = await this.saleCollection.find({
        status: { $gte: 100}
      }).toArray()

      const total = await allTx.reduce((acc, current) => {
        const {btcAmount, tokensAmount } = current
        acc.btcAmount += btcAmount
        acc.tokensAmount += tokensAmount
        return acc
      }, {
        btcAmount: 0,
        tokensAmount: 0
      })

      await execRedis(this.redis, 'set', ['sale:total-sold', JSON.stringify(total)])
      this.latestUpdate = new Date().getTime()


      this.logs.send({
        sender: 'sale',
        message: 'total-recalculation',
        args: total
      })

      return total
    } else {
      return JSON.parse(await execRedis(this.redis, 'get', ['sale:total-sold']))
    }
  }

  async getBalance (type, req, reply) {
    const user = await this.userClient.getUser(req)

    if (!user) {
      throw new Error()
    }

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
    const { tokensAmount, btcAmount } = await this.updateTotal(req, reply)
    return {
      tokensAmount,
      btcAmount
    }
  }

  async getInfo (req, reply) {
    return {
      endTime: new Date(Date.UTC(2018, 1, 20, 0, 0, 0, 0)),
      startTime: new Date(Date.UTC(2018, 0, 8, 0, 0, 0, 0)),
      hardCap: 50 * 1e6,
      softCap: 10 * 1e6,
      priceBTC: 1 / 50000
    }
  }
}

module.exports = SaleService