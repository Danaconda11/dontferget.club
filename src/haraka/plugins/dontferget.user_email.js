let config = require('../../config.js')
// HACK josh: read this from some proper config
config.mongo_host = '172.17.0.2'
config.mongo_database = 'todo'
let users = require('../../users.js')

exports.hook_mail = async function (next, conn, [from]) {
  try {
    let email = from.address()
    let user = await users.find_one({email})
    if (user) {
      next(CONT)
    } else {
      next(DENY)
    }
  } catch (e) {
    this.loginfo(e.stack)
  }
}
