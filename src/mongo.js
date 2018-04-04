const mongo = require('mongodb')
const config = require('./config')
let E = module.exports

let connection
E.connect = async () => {
  if (!connection) {
    connection = await mongo.MongoClient.connect(
      `mongodb://${config.mongo_host}/${config.mongo_database}`,
    )
  }
  return connection.db(config.mongo_database)
}

E.ObjectId = mongo.ObjectId
