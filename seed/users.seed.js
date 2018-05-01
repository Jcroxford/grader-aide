const ObjectId = require('mongodb').ObjectID;

const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(1);

module.exports = [
  {
    _id: new ObjectId(),
    name: 'joe',
    email: 'joe@email.com',
    password: bcrypt.hashSync('admin', salt),
    type: 'admin'
  },
  {
    _id: new ObjectId(),
    name: 'sam',
    email: 'sam@email.com',
    password: bcrypt.hashSync('aguynamedsam', salt),
    type: 'student'
  }
];
