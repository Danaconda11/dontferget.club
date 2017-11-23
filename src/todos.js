const mongo = require('./mongo')
E = module.exports

// TODO daniel: get rid of the duplicated pattern
// connect().then(db.collection('todos')) -> mongo.collection('todos') wrapper
E.find_by_id = id_string => {
  return mongo.connect().then(db => {
    return db.collection('todos').findOne({ _id: mongo.ObjectId(id_string) })
  })
}

E.insert = todo => {
  return mongo.connect().then(db => {
    return db.collection('todos').insert(todo)
  })
}

E.find_all = async query => {
  let db = await mongo.connect()
  return await db.collection('todos').find(query).toArray()
}

E.update = (_id, update) => {
  return mongo.connect().then(db => {
    return db.collection('todos')
      .update({ _id: mongo.ObjectId(_id) }, { $set: update })
  })
}

E.remove = _id => {
  return mongo.connect().then(db => {
    return db.collection('todos').remove({ _id: mongo.ObjectId(_id) })
  })
}
