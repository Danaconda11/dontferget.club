const mongo = require('./mongo')
const config = require('./config')
const todo_queue = require('./todo_queue')
const bcrypt = require('bcrypt')
const lists = require('./lists')

async function create_dummy_records() {
  let db = await mongo.connect()
  // TODO josh: check if this is still needed
  await db.createCollection('test')
  await db.collection('test').insertOne({title: 'test', completed: false})
  let password = await bcrypt.hash('password', 1)
  await db
    .collection('users')
    .update(
      {username: 'josh'},
      {$set: {email: 'user@dontferget.club', password}},
      {upsert: true},
    )
}

async function migrate_list_metadata() {
  let db = await mongo.connect()
  let todo_db = db.collection('todos')
  let user_ids = await todo_db.distinct('user_id')
  for (let user_id of user_ids) {
    let lists_names = await todo_db.distinct('list', {user_id})
    for (let name of lists_names) {
      if (!(await lists.find_by_name(user_id, name))) {
        await lists.create({name, user_id})
      }
    }
  }
}

module.exports = async () => {
  // HACK josh: disabling automatic account creation for now
  if (config.debug) {
    await create_dummy_records()
  }
  // NOTE: temporary until list metadata is not stored in todos anymore
  await migrate_list_metadata()
  // TODO josh: we should have a centralized logger that reports errors
  todo_queue.watch().on('error', e => {
    console.error(e)
  })
}
