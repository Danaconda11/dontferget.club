const mongo = require('../mongo')
const files = require('../files')
const config = require('../config')
const util = require('util')
const users = require('../users')
const _ = require('lodash')
const bcrypt = require('bcrypt');

let E = module.exports

E.sign_up = async (req, res, next) => {
  let email = req.body.username
  let pass = req.body.password 
  if (!email) {
    return res.status(400).send('bad email address')
  }
  let user = await users.find_one({ email })
  if (user) {
    return res.status(403).send('account already exists')
  }
  if (!pass) {
    return res.status(400).send('bad password')
  }
  let hash = await bcrypt.hash(pass, 5)
  let user_insert = {
    email,
    password: hash
  }
  let new_user = await users.create({ user_insert })
  req.login(new_user, err =>  {
    if (err) { 
      return next(err) 
    }
    res.redirect('/lists')
  })
}

E.login = (req, res, next) => {
  // HACK josh: automatically creating the user on login attempt is bad security
  mongo.connect().then(db => {
    let user = req.body
    return db.collection('users').update(user, { $set: user }, { upsert: true })
      .then(() => {
        return users.find_one({ username: user.username })
      }).then(user => {
        return util.promisify(req.login.bind(req))(user)
      }).then(() => {
        res.redirect('/')
      })
  }).catch(err => {
    console.error(err)
    next(err)
  })
}

E.logout = (req, res) => {
  req.logout()
  res.redirect('/login')
}

E.logged_in = (req, res) => {
  res.json(req.user)
}
