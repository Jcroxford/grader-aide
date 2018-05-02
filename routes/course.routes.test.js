const request = require('supertest');
const app = require('../app');
const db = require('../db');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });

// seed data
const coursesSeed = require('../seed/courses.seed.js');

describe('get /courses', function() {
  it('returns all the courses', function(done) {
    request(app)
      .get('/api/courses', requireAuth)
      .expect(res => {
        expect(res.body).toExist();
      })
      .expect(200, done);
  });
});
