const mongo = require('./mongo')
let E = module.exports
E.add = async (user, email) => {
  let client = await mongo.connect()
  await client.createCollection('incoming_emails', {capped: true, size: 100e6})
  return await client.collection('incoming_emails').insert({
    user_id: user._id,
    body: email,
    processed: false,
  })
}
