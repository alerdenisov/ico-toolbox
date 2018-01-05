'use strict'

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
  constructor ({ paymentsCollection, walletsCollection, mongo }) {
    this.paymentsCollection = paymentsCollection
    this.walletsCollection = walletsCollection
    ObjectId = mongo.ObjectId
  }
}

module.exports = PaymentsService
