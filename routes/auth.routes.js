const router = require('express').Router();
// const passportService = require('../services/passport'); // used automagically by passport
const passport = require('passport');

const requireLogin = passport.authenticate('local', { session: false });

router.post('/login', requireLogin, (req, res) => {
  res.json({
    message: 'run you fools',
    username: req.user.username,
    password: req.user.password
  });
});

module.exports = router;
