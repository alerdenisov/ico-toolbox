'use strict'

module.exports = async function (db, paymentsCollection, walletsCollection) {
  const { name: paymentsName } = paymentsCollection.s
  const { name: walletsName } = walletsCollection.s

  await db.createCollection(paymentsName)
  await db.createCollection(walletsName)
  
  await db.command({
    'collMod': walletsName,
    validator: {
      userId: { $type: 'objectId' },
      wallet: { $type: 'string' },
      currency: { $type: 'string' }
    }
  })
  await db.command({
    'collMod': paymentsName,
    validator: {
      wallet: { $type: 'object' },
      'wallet._id': { $type: 'objectId' },
      'wallet.currency': { $type: 'string' },
      amount: { $type: 'number' }
    }
  })

  await walletsCollection.createIndex({ 'userId': 1 })
  await walletsCollection.createIndex({ 'currency': 2 })
  await paymentsCollection.createIndex({ 'wallet._id': 2 })
}
