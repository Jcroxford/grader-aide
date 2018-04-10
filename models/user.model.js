/**
 * This is how a user looks
 * @param {string} _id - unique
 * @param {string} username
 * @param {string} email - unique
 * @param {string} password
 * @param {string} studentId
 */
// todo add tsconfig file for our vscode editors to benefit from typescript linting?
const bcrypt = require('bcryptjs');
const db = require('../db');

async function create(user) {
  const collection = db.collection('users');

  const existingUser = await findUser({ email: user.email });
  if (existingUser) throw new Error('user error - email already in use. unable to create user');

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

async function findUser(searchParams) {
  const collection = db.collection('users');

  return await collection.findOne(searchParams);
}

module.exports = {
  create,
  findUser
};
