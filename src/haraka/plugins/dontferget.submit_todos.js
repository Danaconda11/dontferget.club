let config = require('../../config.js')
config.mongo_database = 'todo'
let users = require('../../users.js')
let todo_queue = require('../../todo_queue.js')

exports.register = function () {
  // HACK josh: don't do this
  config.mongo_host = this.config.get('dontferget.ini').main.mongo_host
}

exports.hook_mail = async function (next, conn, [from]) {
  try {
    let email = from.address()
    let user = await users.find_one({email})
    if (user) {
      conn.transaction.notes.user = user
      next(CONT)
    } else {
      next(DENY)
    }
  } catch (e) {
    next(DENYSOFT)
    this.loginfo(e.stack)
  }
}

exports.hook_rcpt = async function (next, conn, [to]) {
  if (to.address() !== 'inbox@dontferget.club') {
    next(DENY)
  }
  next(OK)
}

exports.hook_queue = async function (next, conn) {
  this.loginfo('stuff?')
  conn.transaction.message_stream.get_data(async buff => {
    try {
      await todo_queue.add(conn.transaction.notes.user, buff)
      next(OK)
    } catch (e) {
      next(DENYSOFT)
      this.loginfo(e.stack)
    }
  })
}
