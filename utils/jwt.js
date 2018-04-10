const jwt = require('jsonwebtoken');

// todo we want to add anything else to the token or add an expiration?
function generateJWT({ username, email }) {
  return jwt.sign({ username, email }, process.env.JWT_SECRET);
}

module.exports = { generateJWT };
