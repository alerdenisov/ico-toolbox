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
      // 'walletId': { $type: 'objectId' },
      // userId: { $type: 'objectId' },
      txId: { $type: 'string' },
      currency: { $type: 'string' },
      status: { $type: 'number' },
      address: { $type: 'string' },
      btcRate: { $type: 'number' },
      amount: { $type: 'number' },
      btcAmount: { $type: 'number' }
    }
  })

  await walletsCollection.createIndex({ 'userId': 1 })
  await walletsCollection.createIndex({ 'currency': 2 })
  await paymentsCollection.createIndex({ 'txId': 1 })
  await paymentsCollection.createIndex({ 'userId': 2 })
}
