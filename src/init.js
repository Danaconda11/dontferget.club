const mongo = require('./mongo')
const config = require('./config')
const todo_queue = require('./todo_queue')

let create_dummy_records = () => {
  return mongo.connect().then(db => {
    return db.createCollection("test", {}).then(() => {
      return db.collection('test').insertOne({title : 'test', completed : false})
    }).then(() => {
      return db.collection('users').update({username: 'josh'},
        {$set: {email: 'joshwillik@gmail.com'}}, {upsert: true})
    })
  })
}

module.exports = async () => {
  // HACK josh: disabling automatic account creation for now
  if (false && config.debug) {
    await create_dummy_records()
  }
  // TODO josh: we should have a centralized logger that reports errors
  todo_queue.watch().on('error', e => {
    console.error(e)
  })
}
