// load env variables
require('../config/config');

// db connection helper methods
const db = require('../db');
const ObjectId = require('mongodb').ObjectID;

// seed data
const coursesSeed = require('../seed/courses.seed.js');

const app = require('../server');

const supertest = require('supertest');

describe('get /courses', function() {
  it('returns all the courses', function(done) {
    supertest(app)
      .get('/courses')
      .expect(200);
  });
});
