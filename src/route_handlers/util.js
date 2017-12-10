const users = require('../users')
const util = require('util')
let E = module.exports

E.redirect = path => {
  return (req, res) => res.redirect(path)
}

E.http_handler = fn => {
  return async (req, res, next) => {
    try {
      await fn(req, res,  next)
    } catch (e) {
      next(e)
    }
  }
}

E.auto_login = (req, res, next) => {
  users.find_one({username: 'josh'}).then(user => {
    return util.promisify(req.login.bind(req))(user)
  }).then(() => {
    next()
  }).catch(next)
}
