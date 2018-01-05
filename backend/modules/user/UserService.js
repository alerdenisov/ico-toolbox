'use strict'

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

  var hash = sha256.create();
  hash.update(str);
  console.log(hash.digest().toHex().substr(0, 24))
  return new ObjectId(hash.digest().toHex().substr(0, 24));
}


class UserService {
  constructor ({ userCollection, mongo }) {
    this.userCollection = userCollection
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

  async updateProfile (profile) {
    const sanitazedProfile = this.sanitazeProfile(profile)
    console.log(sanitazedProfile)
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
  }

  async getProfile (sub) {
    const _id = this.sanitazeId(sub)
    const user = await this.userCollection.findOne({ userId: _id })
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
