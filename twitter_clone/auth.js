var passport = require('passport')
var fixtures = require('./fixtures')
var LocalStrategy = require('passport-local').Strategy

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

passport.use( new LocalStrategy(
	function(username, password, done) {
		var users = fixtures.users.filter( function(user) {
			return user.id === username
		});
		if (users.length === 0) {
			return done(null, false, { message: 'Incorrect username.' });
		} else {
			var user = users[0];
			if (user.password !== password) {
				return done(null, false, { message: 'Incorrect password.' });
			} else {
				return done(null, user)
			}
		}
	}
	))

module.exports = passport