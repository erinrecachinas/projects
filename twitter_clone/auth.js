var passport = require('passport')
var fixtures = require('./fixtures')

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  var users = fixtures.users.filter(function(user) {
  	return user.id === id
  })

  if(users.length === 0) { done(null, false) }
  else {done(null, users[0])}
});

module.exports = passport