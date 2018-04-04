const passport = require('passport')
const WunderlistStrategy = require('passport-wunderlist')
const config = require('./config').wunderlist
const users = require('./users')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

passport.serializeUser((user, done) => {
  done(null, user._id)
})
passport.deserializeUser((id, done) => {
  users
    .find_by_id(id)
    .then(user => {
      done(null, user)
    })
    .catch(done)
})
passport.use(
  new WunderlistStrategy(
    {
      passReqToCallback: true,
      clientID: config.client_id,
      clientSecret: config.client_secret,
      // TODO josh: find a way to listen on an external URL for callback requests
      // in any network. Currently will only work for josh
      callbackURL: 'http://laptop.joshwillik.com/auth/wunderlist/callback',
    },
    (req, access_token, refresh_token, profile, done) => {
      let data = {access_token, id: profile.id}
      users
        .link_external(req.user, 'wunderlist', data)
        .then(() => {
          done(null, req.user)
        })
        .catch(done)
    },
  ),
)

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      let user = await users.find_one({email: username})
      if (!user) {
        return done(null, false)
      }
      let valid = await bcrypt.compare(password, user.password)
      if (!valid) {
        return done(null, false)
      }
      return done(null, user)
    } catch (error) {
      done(error)
    }
  }),
)

module.exports = passport
