'use strict'

const { execRedis } = require('../../lib/utils')
const sha256 = require('node-forge').md.sha256
const md5 = require('spark-md5').hash
const boom = require('boom')
const DUPLICATE_KEY_ERROR_CODE = 11000

let ObjectId

function stringToOjectId (str) {
  if (!ObjectId) {
    throw new Error('Initialize User Service firstly')
  }

  if (typeof str !== 'string') {
    throw new Error('Seed should be a string')
  }

  var hash = sha256.create()
  hash.update(str)
  return hash.digest().toHex().substr(0, 24)
}

class UserService {
  constructor ({ userCollection, mongo, redis }) {
    this.userCollection = userCollection
    this.redis = redis
    ObjectId = mongo.ObjectId

    this.prepareDb()
  }

  async prepareDb() {
    const users = await this.userCollection.find({ refId: { $exists: false } }).toArray()

    users.forEach(user => {
      console.log('set refid for', user._id)
      this.userCollection.update({ userId: user.userId }, {
        $set: { refId: md5(user.email).substr(0, 5) }
      })
    })
  }

  sanitazeId (sub) {
    return stringToOjectId(sub)
  }

  sanitazeProfile (profile) {
    return {
      userId: this.sanitazeId(profile.sub),
      refId: md5(profile.email).substr(0, 5),
      email: profile.email,
      name: profile.given_name + ' ' + profile.family_name,
      nickname: profile.nickname || (profile.given_name + ' ' + profile.family_name),
      picture: profile.picture || 'https://developmentseed.org/images/team/avatar-placeholder.png',
      gender: profile.gender || 'unknown',
      roles: profile.roles
    }
  }

  async updateProfile (profile, token, referrer) {
    let refUser
    const sanitazedProfile = this.sanitazeProfile(profile)
    console.log('Referrer is: ', referrer)
    if (referrer) {
      refUser = await this.userCollection
        .findOne({ refId: referrer })

      console.log(refUser)

      if (!refUser) {
        throw boom.notFound('Referrer user not found')
      }
    }

    let writeResult
    try {
      writeResult = await this.userCollection
        .updateOne(
          { email: sanitazedProfile.email }, 
          sanitazedProfile, 
          { upsert: true })
    } catch (e) {
      if (e.code === DUPLICATE_KEY_ERROR_CODE) {
        throw boom.badRequest('Username not available')
      }
      throw boom.badRequest(e)
    }

    if (refUser) {
      await this.userCollection.updateOne(
        { 
          email: sanitazedProfile.email, 
          referrer: { $exists: false }
        },
        {
          $set: { referrer: refUser.refId }
        }
      )
    }

    if (!writeResult.modifiedCount && !writeResult.upsertedCount) {
      throw boom.badRequest('Boh...')
    }
    
    await execRedis(this.redis, 'set', [`users:profiles:${token}`, sanitazedProfile.userId])
  }

  async getProfile (token) {
    const userId = await execRedis(this.redis, 'get', [`users:profiles:${token}`])
    const user = await this.userCollection.findOne({ userId })
    return user
  }

  async getUser (userId) {
    userId = typeof userId === 'string' ? ObjectId.createFromHexString(userId) : userId
    return await this.userCollection.findOne({ _id: userId })
  }

  async search (searchString) {
    const query = {
      email: { $regex: searchString }
    }

    const users = await this.userCollection.find(query).limit(5).toArray()
    return users
  }

  async getMyRefId (req, reply) {
    const me = await this.getProfile(req.headers.authorization)
    if (!me) {
      throw boom.badRequest('User not found')
    }

    return me.refId
  }

  async getMyReferrer (req, reply) {
    const me = await this.getProfile(req.headers.authorization)
    if (!me) {
      throw boom.badRequest('User not found')
    }

    return me.referrer
  }

  async getReferrals (refId) {
    const users = await this.userCollection.find({ referrer: refId }).toArray()
    for (let user of users) {
      // TODO: move to sale and dont overuse it!
      user.contributed = await execRedis(this.redis, 'get', [`sale:${user._id}:contributed`])
    }

    return users
  }

  async getMyReferrals (req, reply) {
    const me = await this.getProfile(req.headers.authorization)
    if (!me) {
      throw boom.badRequest('User not found')
    }

    return await this.getReferrals(me.refId)
  }

  async checkRefId (req, reply) {
    console.log(req.body)
    const user = await this.userCollection.findOne({ refId: req.body.refId })
    console.log(user)
    return !!user
  }

  async allUsers (req, reply) {
    const user = await this.getProfile(req.headers.authorization)

    if (!user || user.roles.indexOf('admin') === -1) {
      throw boom.badRequest('Not autherized request')
    }

    return this.userCollection.find({}).toArray()
  }
}

module.exports = UserService
