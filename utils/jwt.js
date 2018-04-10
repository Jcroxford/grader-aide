const jwt = require('jsonwebtoken');

// todo we want to add anything else to the token or add an expiration?
function generateJWT({ _id, username, email, type }) {
  return jwt.sign({ _id, username, email, type }, process.env.JWT_SECRET);
}

module.exports = { generateJWT };
