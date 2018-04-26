// load env variables
require('../config/config');

// db connection helper methods
const db = require('../db');
const ObjectId = require('mongodb').ObjectID;

// seed data
const coursesSeed = require('../seed/courses.seed.json');

const courses = require('./courses.model');

function deepCopy(x) {
  return JSON.parse(JSON.stringify(x));
}

describe('courses.models.js', () => {
  beforeAll(() => db.connect());
  afterAll(() => db.close());

  let collection;
  let premadeCourses;
  beforeEach(() => {
    collection = db.get().collection('courses');

    premadeCourses = deepCopy(coursesSeed).map(course => ({ ...course, _id: new ObjectId() }));
    return collection.insertMany(premadeCourses);
  });
  afterEach(() => {
    return collection.remove({});
  });

  describe('preview()', () => {
    it(`returns an array of objects containing a course's name and id`, () => {
      const expected = premadeCourses.map(course => ({
        _id: course._id,
        name: course.name
      }));

      return courses.preview().then(courses => {
        expect(courses).toEqual(expected);
      });
    });
  });

  describe('findById()', () => {
    it(`returns a course when given that course's id`, () => {
      const expectedCourse = premadeCourses[0];
      const expectedCourseId = expectedCourse._id;

      return courses
        .findById(expectedCourseId)
        .then(course => expect(course).toEqual(expectedCourse));
    });

    it(`returns null when given an id for a course that doesn't exist in the db`, () => {
      const idThatShouldNotExist = new ObjectId();

      return courses.findById(idThatShouldNotExist).then(course => expect(course).toBeNull());
    });
  });

  describe('createCourse()', () => {
    const course = {
      name: 'this is a course. A wonderful course',
      assignments: [
        {
          _id: new ObjectId(),
          name: 'the first assignments of the class',
          totalPts: 100,
          rules: [
            {
              _id: new ObjectId(),
              pts: -5,
              desc: 'this is how a rule looks'
            }
          ],
          comments: [
            {
              _id: new ObjectId(),
              desc: 'this is how a comment looks'
            }
          ]
        }
      ],
      studentsEnrolled: [new ObjectId(), new ObjectId(), new ObjectId()]
    };

    it('returns a valid objectId after course is created', () => {
      return courses.createCourse(course).then(id => {
        expect(ObjectId.isValid(id)).toBeTruthy();
      });
    });
    it('adds course given as a parameter to the database', () => {
      let createdCourseId;
      return courses
        .createCourse(course)
        .then(id => {
          createdCourseId = ObjectId(id).toString();
          const collection = db.collection('courses');

          return collection.findOne({ _id: ObjectId(id) });
        })
        .then(createdCourse => {
          expect(createdCourse).toMatchObject(course);
        });
    });
  });

  describe('destroyCourse()', () => {
    it('removes course from collection and returns truth value if removed successfully', () => {
      const courseId = premadeCourses[0]._id;

      return courses
        .destroyCourse(courseId)
        .then(deleted => {
          expect(deleted).toBeTruthy();

          return collection.find({}).toArray();
        })
        .then(courses => expect(courses.length).toBe(premadeCourses.length - 1));
    });

    it('does not remove a course if and returns falsey value if id does not exist', () => {
      const courseId = new ObjectId();

      return courses
        .destroyCourse(courseId)
        .then(deleted => {
          expect(deleted).toBeFalsy();

          return collection.find({}).toArray();
        })
        .then(courses => expect(courses.length).toBe(premadeCourses.length));
    });
  });
});
