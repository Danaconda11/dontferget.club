const mongo = require('./mongo')
const mailparser = require('mailparser')
const EventEmitter = require('events').EventEmitter
const todos = require('./todos')
let E = module.exports

const process_message = async (pipe, message) => {
  try {
    let mail = await mailparser.simpleParser(message.body)
    let todo = {
      user_id: message.user_id,
      title: mail.subject.trim(),
      notes: mail.text.trim(),
      list: ['Inbox'],
    }
    await todos.insert(todo)
  } catch (e) {
    pipe.emit('error', e)
  }
}

E.add = async (user, email) => {
  let client = await mongo.connect()
  return await client
    .collection('incoming_emails')
    .insert({user_id: user._id, body: email})
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const _watch = async pipe => {
  while (true) {
    // TODO josh: add debug log line like "checking for messages"
    let client = await mongo.connect()
    let incoming = client.collection('incoming_emails')
    let messages = await incoming
      .find({processed_at: {$exists: false}})
      .toArray()
    for (let message of messages) {
      await process_message(pipe, message)
      await incoming.update(
        {_id: message._id},
        {$set: {processed_at: new Date()}},
      )
    }
    await sleep(1e3)
  }
}

E.watch = () => {
  let pipe = new EventEmitter()
  _watch(pipe)
  return pipe
}
