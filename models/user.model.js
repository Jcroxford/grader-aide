/**
 * This is how a user looks
 * @param {string} _id
 * @param {string} username
 * @param {string} password
 * @param {string} studentId
 */
const bcrypt = require('bcryptjs');
const db = require('../db');

async function create(user) {
  const collection = db.collection('users');

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);

  const userWithHash = {
    ...user,
    password: hash
  };

  const { result, ops } = await collection.insertOne(userWithHash);

  if (!result.ok) throw new Error('unable to create user');

  return ops[0];
}

module.exports = {
  create
};
