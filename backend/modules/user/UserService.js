'use strict'

const { execRedis } = require('../../lib/utils')
const sha256 = require('node-forge').md.sha256
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
  }

  sanitazeId (sub) {
    return stringToOjectId(sub)
  }

  sanitazeProfile (profile) {
    return {
      userId: this.sanitazeId(profile.sub),
      email: profile.email,
      name: profile.given_name + ' ' + profile.family_name,
      nickname: profile.nickname || (profile.given_name + ' ' + profile.family_name),
      picture: profile.picture || 'https://developmentseed.org/images/team/avatar-placeholder.png',
      gender: profile.gender || 'unknown'
    }
  }

  async updateProfile (profile, token) {
    const sanitazedProfile = this.sanitazeProfile(profile)
    let writeResult
    try {
      writeResult = await this.userCollection.updateOne({ userId: sanitazedProfile.userId }, sanitazedProfile, { upsert: true })
    } catch (e) {
      if (e.code === DUPLICATE_KEY_ERROR_CODE) {
        throw boom.badRequest('Username not available')
      }
      throw boom.badRequest(e)
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

  async search (searchString) {
    const query = {
      email: { $regex: searchString }
    }

    const users = await this.userCollection.find(query).limit(5).toArray()
    return users
  }
}

module.exports = UserService
