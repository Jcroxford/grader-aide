const request = require('supertest');
const jwt = require('jsonwebtoken');

const app = require('../app');
const db = require('../db');

const usersSeed = require('../seed/users.seed');

describe('/auth routes', () => {
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

    it('returns valid jwt token if given valid data', () => {
      const user = {
        name: 'john doe',
        password: 'example',
        confirmPassword: 'example',
        email: 'example@email.com'
      };

      return request(app)
        .post('/api/auth/signup')
        .send(user)
        .expect(200)
        .expect(res => {
          // throws an error and fails test if token is invalid
          const { _id } = jwt.verify(res.body.token, process.env.JWT_SECRET);

          expect(res.body.token);
        });
    });
  });

  describe('/login', () => {
    it('returns 401 if given invalid credentials', () => {
      const user = {
        email: usersSeed[0].email,
        password: 'some invalid password that was not used before'
      };

      return request(app)
        .post('/api/auth/login')
        .send(user)
        .expect(401);
    });

    it('returns valid jwt if user is found and authenticated in the database', () => {
      const user = {
        email: usersSeed[0].email,
        password: 'admin' // password of userSeed[0] before hash
      };

      return request(app)
        .post('/api/auth/login')
        .send(user)
        .expect(200)
        .expect(res => {
          const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);

          expect(decoded).toMatchObject({
            _id: usersSeed[0]._id.toHexString(),
            email: usersSeed[0].email,
            type: usersSeed[0].type
          });
        });
    });
  });

  describe('/validate-token', () => {
    it('returns 401 if given invalid jwt', () => {
      const invalidToken = jwt.sign({}, 'wrong seed');

      request(app)
        .post('api/auth/validate-token')
        .set('authorization', invalidToken)
        .expect(401);
    });

    it('returns status 200 if token validates an existing user', () => {
      const userForToken = {
        _id: usersSeed[0]._id // only value needed for validation
      };
      const invalidToken = jwt.sign(userForToken, process.env.JWT_SECRET);

      request(app)
        .post('api/auth/validate-token')
        .set('authorization', invalidToken)
        .expect(200);
    });
  });
});
