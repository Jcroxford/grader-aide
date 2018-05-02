const request = require('supertest');

const app = require('../app');
const db = require('../db');

describe('/auth routes', () => {
  beforeAll(() => db.connect());
  afterAll(() => db.close());

  describe('/signup', () => {
    it('responds with 400 status if name field is missing from request body', () => {
      const user = {};

      request(app)
        .post('/api/auth/signup')
        .send(user)
        .expect(400)
        .expect(res => {
          expect(res.body.error).toBe('name is required');
          done();
        });
    });

    it('responds with 400 status if password field is missing from request body', () => {
      const user = {
        name: 'john doe'
      };

      request(app)
        .post('/api/auth/signup')
        .send(user)
        .expect(400)
        .expect(res => {
          expect(res.body.error).toBe('name is required');
          done();
        });
    });
  });
});
