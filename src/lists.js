const mongo = require('./mongo')
const uuid = require('uuid')
let E = module.exports

E.find_by_object_id = _id => mongo.connect().then(db => {
  return db.collection('lists').findOne({_id})
})

E.find_by_id = (user_id, list_id) => mongo.connect().then(db => {
  if (!user_id) {
    throw new Error('missing user_id')
  }
  if (!list_id) {
    throw new Error('missing list_id')
  }
  return db.collection('lists').findOne({list_id, user_id})
})

E.create = data => mongo.connect().then(async db => {
  data  = Object.assign({
    uuid: uuid.v4(),
    date: new Date(),
    // HACK josh: the line between list name and list_id is very blurry.
    // We should split them and generate a URL friendly list ID out of the list
    // name
    name: data.list_id,
  }, data)
  let insert = await db.collection('lists').insertOne(data)
  return await E.find_by_object_id(insert.insertedId)
})
