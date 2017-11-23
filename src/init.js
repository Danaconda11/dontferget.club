const mongo = require('./mongo')
const config = require('./config')

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

module.exports = () => {
  return create_dummy_records()
}
