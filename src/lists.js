const mongo = require('./mongo')
const uuid = require('uuid')
let E = module.exports

E.validate = list => {
  let errors = []
  // TODO josh: move all list validation here
  let allowed_fields = `name`.split(/\s+/)
  for (let [field, value] of Object.entries(list)) {
    if (allowed_fields.includes(field)) {
      continue
    }
    errors.push({message: `Unknown field: ${field}`, field})
  }
  return errors.length ? errors : undefined
}
// TODO josh: finish
E.validate_update = (list, update) => {
  throw new Error('Not implemented yet')
}

E.find_by_object_id = _id =>
  mongo.connect().then(db => {
    return db.collection('lists').findOne({_id})
  })
E.find_by_uuid = uuid =>
  mongo.connect().then(db => {
    return db.collection('lists').findOne({uuid})
  })

E.find_by_id = (user_id, list_id) =>
  mongo.connect().then(db => {
    if (!user_id) {
      throw new Error('missing user_id')
    }
    if (!list_id) {
      throw new Error('missing list_id')
    }
    return db.collection('lists').findOne({list_id, user_id})
  })

E.create = data =>
  mongo.connect().then(async db => {
    data = Object.assign(
      {
        uuid: uuid.v4(),
        date: new Date(),
        // HACK josh: the line between list name and list_id is very blurry.
        // We should split them and generate a URL friendly list ID out of the list
        // name
        name: data.list_id,
      },
      data,
    )
    if (!data.user_id) {
      throw new Error('A list must have a user_id')
    }
    let insert = await db.collection('lists').insertOne(data)
    return await E.find_by_object_id(insert.insertedId)
  })
