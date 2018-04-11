const router = require('express').Router();
const passport = require('passport');

const requireLogin = passport.authenticate('local', { session: false });

// fixme example code for using jwt auth. leaving here for now but needs to be removed if we end using it somehwere else
// we probably want a controller rapper for checking for student or admin types
const requireAuth = passport.authenticate('jwt', { session: false });

const User = require('../models/user.model');
const jwtUtils = require('../utils/jwt');

router.post('/signup', (req, res) => {
  const user = req.body;
  // validate fields exist (primitive validation for now)
  // todo to we want to take this past primitive?
  if (!user.name) return res.status(400).json({ error: 'name is required' });
  if (!user.password) return res.status(400).json({ error: 'password is required' });
  if (!user.confirmPassword) return res.status(400).json({ error: 'confirmPassword is required' });
  if (!user.email) return res.status(400).json({ error: 'email is required' });
  if (user.password !== user.confirmPassword)
    return res.status(400).json({ error: 'passwords must match' });

  delete user.confirmPassword; // no longer needed after validated and we dont want to save it do db
  User.create(user)
    .then(user => {
      return user;
    })
    .then(jwtUtils.generateJWT)
    .then(token => {
      res.json({
        success: true,
        message: 'user created successfully',
        token
      });
    })
    .catch(err => {
      if (err.message.startsWith('user error')) return res.status(400).json({ error: err.message });

      res.status(500).json({
        error:
          'unable to complete your request. check the code if you are an approved member of the team'
      });
    });
});

router.post('/login', requireLogin, (req, res) => {
  res.json({
    success: true,
    message: 'user login successfully',
    token: jwtUtils.generateJWT(req.user)
  });
});

module.exports = router;
