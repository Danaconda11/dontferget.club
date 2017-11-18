const mongo = require('./mongo')
let E = module.exports

E.find_by_id = id => mongo.connect().then(db => {
  return db.collection('users').findOne({ _id: mongo.ObjectId(id) })
})

E.create = user => mongo.connect().then(async db => {
  let write_result = await db.collection('users').insert(user)
  return await E.find_by_id(write_result.insertedIds[0])
})

E.find_one = selector => mongo.connect().then(db => {
  return db.collection('users').findOne(selector)
})

E.link_external = (user, provider, data) => mongo.connect().then(db => {
  return db.collection('users').update({ username: user.username }, {
    $set: { [`external.${provider}`]: data }
  })
})
