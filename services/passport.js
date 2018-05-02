const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');

const User = require('../models/user.model');

passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
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

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.JWT_SECRET
};
passport.use(
  new JwtStrategy(jwtOptions, (userFromToken, done) => {
    console.log(userFromToken);
    User.findUser({ _id: ObjectId(userFromToken._id) })
      .then(user => {
        console.log(user);
        if (!user) return done(null, false);
        if (user.type !== userFromToken.type) return done(null, false);

        return done(null, user);
      })
      .catch(err => done(err, false));
  })
);

module.exports = passport;
