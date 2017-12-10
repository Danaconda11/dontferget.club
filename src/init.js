const mongo = require('./mongo')
const config = require('./config')
const todo_queue = require('./todo_queue')
const bcrypt = require('bcrypt')

let create_dummy_records = async () => {
  let db = await mongo.connect()
  await db.createCollection('test')
  await db.collection('test').insertOne({title : 'test', completed : false})
  let password = await bcrypt.hash('password', 1)
  await db.collection('users').update({username: 'josh'},
    {$set: {email: 'user@dontferget.club', password}}, {upsert: true})
}

module.exports = async () => {
  // HACK josh: disabling automatic account creation for now
  if (config.debug) {
    await create_dummy_records()
  }
  // TODO josh: we should have a centralized logger that reports errors
  todo_queue.watch().on('error', e => {
    console.error(e)
  })
}
