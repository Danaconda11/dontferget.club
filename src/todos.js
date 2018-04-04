const mongo = require('./mongo')
E = module.exports

E.find_by_id = async id_string => {
  let db = await mongo.connect()
  return await db.collection('todos').findOne({_id: mongo.ObjectId(id_string)})
}

E.insert = async todo => {
  let db = await mongo.connect()
  return db.collection('todos').insert(todo)
}

E.find_all = async query => {
  let db = await mongo.connect()
  return await db
    .collection('todos')
    .find(query)
    .toArray()
}

E.update = async (_id, update) => {
  let db = await mongo.connect()
  return db
    .collection('todos')
    .update({_id: mongo.ObjectId(_id)}, {$set: update})
}

E.remove = async _id => {
  let db = await mongo.connect()
  return db.collection('todos').remove({_id: mongo.ObjectId(_id)})
}
