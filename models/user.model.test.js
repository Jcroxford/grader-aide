// load env variables
require('../config/config');

// db connection helper methods
const db = require('../db');
const ObjectId = require('mongodb').ObjectID;

const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(1);

// seed data
const usersSeed = require('../seed/users.seed.js');

const users = require('./user.model');

describe('user.models.js', () => {
  beforeAll(() => db.connect());
  afterAll(() => db.close());

  let collection;
  beforeEach(() => {
    collection = db.get().collection('users');

    return collection.remove({}).then(() => collection.insertMany(usersSeed));
  });
  afterEach(() => {
    return collection.remove({});
  });

  describe('create()', () => {
    const user = {
      name: 'fdsa',
      email: 'fdsa@fdsa.com',
      password: bcrypt.hashSync('fdsa', salt),
      type: 'student'
    };

    it('returns a valid after user is created', () => {
      return users.create(user).then(user => {
        expect(ObjectId.isValid(user._id)).toBeTruthy();
      });
    });

    it('adds user given as a parameter to the database', () => {
      let createdUserId;
      return users
        .create(user)
        .then(createdUser => {
          createdUserId = ObjectId(createdUser._id);

          const collection = db.collection('users');

          return collection.findOne(createdUserId);
        })
        .then(foundUser => {
          const expectedUser = {
            name: 'fdsa',
            email: 'fdsa@fdsa.com',
            type: 'student'
          };
          expect(foundUser).toMatchObject(expectedUser);
        });
    });
  });

  describe('findUser()', () => {
    it(`returns a user when given that user's id`, () => {
      const expectedUser = usersSeed[0];
      const expectedUserId = expectedUser._id;

      return users
        .findUser(expectedUserId)
        .then(foundUser => expect(foundUser).toEqual(expectedUser));
    });

    it(`returns null when given an id for a course that doesn't exist in the db`, () => {
      const idThatShouldNotExist = new ObjectId();

      return users.findUser(idThatShouldNotExist).then(user => expect(user).toBeNull());
    });
  });
});
