const router = require('express').Router();

const User = require('../models/user.model');
const jwtUtils = require('../utils/jwt');

router.post('/create', (req, res) => {
  const user = req.body;
  // validate fields exist (primitive validation for now)
  // todo to we want to take this past primitive?
  if (!user.username) return res.status(400).json({ error: 'username is required' });
  if (!user.password) return res.status(400).json({ error: 'password is required' });
  if (!user.confirmPassword) return res.status(400).json({ error: 'confirmPassword is required' });
  if (!user.email) return res.status(400).json({ error: 'email is required' });
  if (user.password !== user.confirmPassword)
    return res.status(400).json({ error: 'passwords must match' });

  delete user.confirmPassword; // no longer needed after validated and we dont want to save it do db
  User.create(user)
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

module.exports = router;
