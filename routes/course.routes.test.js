const request = require('supertest');
const app = require('../app');
const db = require('../db');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { pick } = require('lodash');
const ObjectId = require('mongodb').ObjectID;

// seed data
const usersSeed = require('../seed/users.seed');
const coursesSeed = require('../seed/courses.seed');

function deepCopy(x) {
  return JSON.parse(JSON.stringify(x));
}

describe('get /courses', function() {
  beforeAll(() => db.connect());
  afterAll(() => db.close());

  let userCollection;
  let courseCollection;
  let authToken;
  beforeEach(() => {
    userCollection = db.get().collection('users');
    courseCollection = db.get().collection('courses');

    return userCollection
      .remove({})
      .then(() => userCollection.insertMany(usersSeed))
      .then(() => courseCollection.insertMany(coursesSeed))
      .then(() => {
        const user = {
          _id: usersSeed[0]._id,
          email: usersSeed[0].email,
          type: usersSeed[0].type
        };
        authToken = jwt.sign(user, process.env.JWT_SECRET);
      });
  });
  afterEach(() => {
    return userCollection.remove({}).then(() => courseCollection.remove({}));
  });

  describe('GET /courses', () => {
    it('returns all the courses', () => {
      return request(app)
        .get('/api/courses')
        .set('authorization', authToken)
        .expect(200)
        .expect(res => {
          const expectedCourses = coursesSeed.map(course => {
            const formatedCourse = pick(course, [
              '_id',
              'courseId',
              'courseName',
              'studentsEnrolled'
            ]);

            return deepCopy(formatedCourse);
          });
          expect(res.body).toEqual(expectedCourses);
        });
    });
  });

  describe('GET /courses/:id', () => {
    it('returns course info stored in database', () => {
      const courseId = coursesSeed[0]._id.toHexString();
      const expectedCourse = deepCopy(coursesSeed[0]);
      return request(app)
        .get(`/api/courses/${courseId}`)
        .set('authorization', authToken)
        .expect(200)
        .expect(res => {
          expect(res.body).toEqual(expectedCourse);
        });
    });

    it('responds with 500 error if passed an id that is invalid or not stored in db', () => {
      return request(app)
        .get(`/api/courses/invalid-id`)
        .set('authorization', authToken)
        .expect(500);
    });
  });

  describe('POST /courses', () => {
    const course = {
      courseName: 'Object Oriented Programming',
      courseId: 'CS1410'
    };

    it('adds course to database', () => {
      return request(app)
        .post('/api/courses')
        .set('authorization', authToken)
        .send(course)
        .expect(200)
        .expect(async res => {
          expect(ObjectId.isValid(res.body.id)).toBeTruthy();

          const addedCourse = await courseCollection.findOne({ _id: ObjectId(res.body.id) });

          return expect(addedCourse).toMatchObject(course);
        });
    });
  });

  describe('PUT /courses/:id', () => {
    it('updates a course if given a valid id', () => {
      const courseId = coursesSeed[0]._id.toHexString();
      const changes = {
        courseName: 'some changed name bro'
      };

      return request(app)
        .put(`/api/courses/${courseId}`)
        .set('authorization', authToken)
        .send(changes)
        .expect(204)
        .expect(async () => {
          const course = await courseCollection.findOne({ _id: ObjectId(courseId) });

          expect(course).toMatchObject(changes);
        });
    });

    it('returns 500 status code if given an invalid or unused id', () => {
      const changes = {
        courseName: 'some changed name bro'
      };

      return request(app)
        .put(`/api/courses/invalid-id`)
        .set('authorization', authToken)
        .send(changes)
        .expect(500);
    });
  });

  describe('DELETE /course/:id', () => {
    it('removes course if it exists', () => {});
  });
});
