const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');

passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    // fixme need true auth eventually
    let persistedUser;
    User.findUser({ email })
      .then(user => {
        if (!user) return false;

        persistedUser = user;

        return bcrypt.compare(password, user.password);
      })
      .then(isAuthenticated => (isAuthenticated ? done(null, persistedUser) : done(null, false)))
      .catch(err => done(err, false));
  })
);

module.exports = passport;
