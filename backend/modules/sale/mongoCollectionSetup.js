'use strict'

module.exports = async function (db, affilatedCollection, saleCollection) {
  const { name: affilatedName } = affilatedCollection.s
  const { name: saleName } = saleCollection.s

  await db.createCollection(affilatedName)
  await db.createCollection(saleName)
  
  await db.command({
    'collMod': affilatedName,
    validator: {
      'referrer': { $type: 'object' },
      'referrer._id': { $type: 'objectId' },
      'affilated': { $type: 'object' },
      'affilated._id': { $type: 'objectId' }
    }
  })

  await db.command({
    'collMod': saleName,
    validator: {
      userId: { $type: 'objectId' },
      txId: { $type: 'string' },
      currency: { $type: 'string' },
      btcAmount: { $type: 'number' },
      tokensAmount: { $type: 'number' },
      updateAt: { $type: 'number' }
    }
  })

  await saleCollection.createIndex({ 'userId': 1 })
  await saleCollection.createIndex({ 'txId': 2 })
  await affilatedCollection.createIndex({ 'referrer._id': 1 })
  await affilatedCollection.createIndex({ 'affilated._id': 2 })
}
