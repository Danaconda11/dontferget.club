const mongo = require('./mongo')
let E = module.exports

E.find_by_id = async id => {
  let db = await mongo.connect()
  return db.collection('users').findOne({_id: mongo.ObjectId(id)})
}

E.create = async user => {
  let db = await mongo.connect()
  let write_result = await db.collection('users').insert(user)
  return await E.find_by_id(write_result.insertedIds[0])
}

E.find_one = async selector => {
  let db = await mongo.connect()
  return db.collection('users').findOne(selector)
}

E.link_external = async (user, provider, data) => {
  let db = await mongo.connect()
  return db.collection('users').update(
    {username: user.username},
    {
      $set: {[`external.${provider}`]: data},
    },
  )
}
