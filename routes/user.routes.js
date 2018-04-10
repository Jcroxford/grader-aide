const router = require('express').Router();

const User = require('../models/user.model');

router.post('/create', (req, res) => {
  User.create(req.body)
    .then(res.json.bind(res))
    .catch(console.log);
});

module.exports = router;
