// TODO josh: decide on a way to avoid babel-ing the whole app
require('babel-register')({extensions: ['.jsx']})
const express = require('express')
const ms = require('ms')
const config = require('./config')
const init = require('./init')
const lists = require('./route_handlers/lists')
const auth = require('./middleware/auth')
const user = require('./route_handlers/user')
const files = require('./files')
const body_parser = require('body-parser')
const passport = require('./passport')
const util = require('./route_handlers/util')
const session = require('express-session')
const compression = require('compression')
const todos = require('./route_handlers/todos')
const shared_list = require('./route_handlers/shared_list')

let app = express()
app.use(compression())
app.use(files.static())
app.get('/view/:token', shared_list)
app.use(session({
  resave: false, saveUninitialized: false,
  secret: config.session_secret,
  cookie: {maxAge: ms('1 week')},
}))
app.use(passport.initialize())
app.use(passport.session())
if (config.auto_login) {
  app.use(util.auto_login)
}
app.use(body_parser.urlencoded({extended: false}))
app.use(body_parser.json())
app.post('/signup', user.sign_up)
app.get('/login', auth.require_no_auth({ otherwise: '/' }),
  files.send_file('login.html'))
app.post('/login', passport.authenticate('local'), util.redirect('/'))
app.get('/logout', user.logout)
app.use(auth.require_auth({otherwise: '/login'}))
app.get('/auth/wunderlist', passport.authenticate('wunderlist'))
app.get('/auth/wunderlist/callback',
  passport.authenticate('wunderlist'),
  util.redirect('/account'))
let frontend_paths = `
  /
  /todo/:todo
  /list/:list
  /list/:list/:todo
  /account
`.split(/\s+/).filter(Boolean)
frontend_paths.forEach(path => app.get(path.trim(), files.send_file('index.html')))
app.get('/api/account', user.logged_in)
app.get('/api/lists', lists.get_all)
// TODO josh: migrate this to POST /api/lists?source=wunderlist to be
// REST compilant
app.post('/api/lists/import', lists.import)
app.post('/api/lists', lists.add)
app.get('/api/lists/:list', lists.get)
app.patch('/api/lists/:list', lists.update)
app.get('/api/lists/:list/todos', todos.get_all)
app.post('/api/todos', todos.add)
app.get('/api/todos/:id', todos.get)
app.patch('/api/todos/:id', todos.update)
app.delete('/api/todos/:id', todos.remove)
app.listen(config.http_port,
  () => console.log(`Listening on 0.0.0.0:${config.http_port}`))
init().catch(err => console.error(err))
