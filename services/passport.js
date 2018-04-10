const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

passport.use(
  new LocalStrategy((username, password, done) => {
    // fixme need true auth eventually
    isAuthenticated = Math.floor(Math.random() * 100) > 50;

    if (!isAuthenticated) return done(null, false, { message: 'you shall not pass!' });

    bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => done(null, { username, password: hash }))
      .catch(console.log);
  })
);

module.exports = passport;
