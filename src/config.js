let utils = require('./utils.js')

let e = process.env
module.exports = {
  debug: e.DEBUG,
  http_port: 80,
  mongo_host: e.MONGO_HOST,
  mongo_database: e.MONGO_DATABASE,
  auto_login: e.DEBUG,
  wunderlist: {
    client_id: e.WUNDERLIST_CLIENT_ID,
    client_secret: e.WUNDERLIST_CLIENT_SECRET,
  },
  session_secret: e.SESSION_SECRET,
  lichess_id: e.LICHESS_ID,
}

utils.deep_freeze(module.exports)


