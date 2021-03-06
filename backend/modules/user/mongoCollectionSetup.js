'use strict'

module.exports = async function (db, userCollection) {
  await db.createCollection(userCollection.s.name)

  await db.command({
    'collMod': userCollection.s.name,
    validator: {
      userId: { $type: 'string' },
      email: { $type: 'string' },
      name: { $type: 'string' },
      nickname: { $type: 'string' },
      picture: { $type: 'string' },
      gender: { $type: 'string' },
      roles: { $type: 'array' }
    }
  })

  await userCollection.createIndex({ userId: 1 }, {unique: true})
  await userCollection.createIndex({ email: 2 }, {unique: true})
  await userCollection.createIndex({ refferer: 3 })
}
