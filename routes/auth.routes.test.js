const request = require('supertest');

const app = require('../app');
const db = require('../db');

describe('/auth routes', () => {
  beforeAll(() => db.connect());
  afterAll(() => db.close());

  describe('/signup', () => {
    it('responds with 400 status if name field is missing from request body', () => {
      const user = {};

      return request(app)
        .post('/api/auth/signup')
        .send(user)
        .expect(400)
        .expect(res => {
          expect(res.body.error).toBe('name is required');
          // done();
        });
    });

    it('responds with 400 status if password field is missing from request body', () => {
      const user = {
        name: 'john doe'
      };

      return request(app)
        .post('/api/auth/signup')
        .send(user)
        .expect(400)
        .expect(res => {
          expect(res.body.error).toBe('password is required');
        });
    });

    it('responds with 400 status if confirmPassword field is missing from request body', () => {
      const user = {
        name: 'john doe',
        password: 'example'
      };

      return request(app)
        .post('/api/auth/signup')
        .send(user)
        .expect(400)
        .expect(res => {
          expect(res.body.error).toBe('confirmPassword is required');
        });
    });

    it('responds with 400 status if email field is missing from request body', () => {
      const user = {
        name: 'john doe',
        password: 'example',
        confirmPassword: 'example'
      };

      return request(app)
        .post('/api/auth/signup')
        .send(user)
        .expect(400)
        .expect(res => {
          expect(res.body.error).toBe('email is required');
        });
    });

    it('responds with 400 status if password and confirm password do not match field is missing from request body', () => {
      const user = {
        name: 'john doe',
        password: 'example',
        confirmPassword: 'example not the same for sure',
        email: 'example@email.com'
      };

      return request(app)
        .post('/api/auth/signup')
        .send(user)
        .expect(400)
        .expect(res => {
          expect(res.body.error).toBe('passwords must match');
        });
    });
  });
});
