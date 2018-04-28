// load env variables
require('../config/config');

// db connection helper methods
const db = require('../db');
const ObjectId = require('mongodb').ObjectID;

// seed data
const coursesSeed = require('../seed/courses.seed.js');

const courses = require('./courses.model');

describe('courses.models.js', () => {
  beforeAll(() => db.connect());
  afterAll(() => db.close());

  let collection;
  beforeEach(() => {
    collection = db.get().collection('courses');

    return collection.remove({}).then(() => collection.insertMany(coursesSeed));
  });
  afterEach(() => {
    return collection.remove({});
  });

  describe('preview()', () => {
    it(`returns an array of objects containing a course's name, courseId and id`, () => {
      const expected = coursesSeed.map(course => ({
        _id: course._id,
        courseName: course.courseName,
        courseId: course.courseId
      }));

      return courses.preview().then(courses => {
        expect(courses).toEqual(expected);
      });
    });
  });

  describe('findById()', () => {
    it(`returns a course when given that course's id`, () => {
      const expectedCourse = coursesSeed[0];
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
      const courseId = coursesSeed[0]._id;

      return courses
        .destroyCourse(courseId)
        .then(deleted => {
          expect(deleted).toBeTruthy();

          return collection.find({}).toArray();
        })
        .then(courses => expect(courses.length).toBe(coursesSeed.length - 1));
    });

    it('does not remove a course if and returns falsey value if id does not exist', () => {
      const courseId = new ObjectId();

      return courses
        .destroyCourse(courseId)
        .then(deleted => {
          expect(deleted).toBeFalsy();

          return collection.find({}).toArray();
        })
        .then(courses => expect(courses.length).toBe(coursesSeed.length));
    });
  });

  describe('createAssignment()', () => {
    const expectedAssignment = {
      _id: new ObjectId(),
      name: 'minimal example assignemnt'
    };
    it('adds an assignment to assignments array of a course', () => {
      const courseId = coursesSeed[0]._id;

      return courses
        .createAssignment(courseId, expectedAssignment)
        .then(() => {
          return collection.findOne({ _id: courseId });
        })
        .then(course => {
          const assignment = course.assignments.pop();
          expect(assignment).toEqual(expectedAssignment);
        });
    });

    it(`adds assignment while creating assignments key if it doesn't exist`, () => {
      // this course does/should not have any assignments in it
      const courseId = coursesSeed[2]._id;

      return courses
        .createAssignment(courseId, expectedAssignment)
        .then(() => {
          return collection.findOne({ _id: courseId });
        })
        .then(course => {
          expect(course).toHaveProperty('assignments', [expectedAssignment]);
        });
    });
  });

  describe('updateAssignment()', () => {
    it('updates specified assignment contained in a course', () => {
      const courseId = coursesSeed[0]._id;
      const assignmentId = coursesSeed[0].assignments[0]._id;
      const expectedUpdatedAssignment = {
        _id: assignmentId.toHexString(),
        assignmentName: 'update everything about this assignment for the test',
        totalPts: '100',
        rules: [
          {
            desc: 'hello there',
            pts: 2,
            checked: false,
            _id: new ObjectId()
          }
        ],
        comments: [
          {
            desc: 'unique to this test bru',
            _id: new ObjectId(),
            checked: false
          }
        ]
      };

      return courses
        .updateAssignment(courseId, assignmentId, expectedUpdatedAssignment)
        .then(saved => {
          expect(saved).toBeTruthy();

          const match = { _id: courseId, 'assignments._id': assignmentId };
          return collection.findOne(match);
        })
        .then(course => {
          const updatedAssignment = course.assignments.find(
            assignment => assignment._id.toHexString() === assignmentId.toHexString()
          );

          expect(updatedAssignment).toEqual({
            ...expectedUpdatedAssignment,
            _id: ObjectId(assignmentId)
          });
        });
    });
  });

  describe('destroyAssignment()', () => {
    it('removes an assignment that exists in a course from that course', () => {
      const courseId = coursesSeed[0]._id;
      const assignmentId = coursesSeed[0].assignments[0]._id;

      return courses
        .destroyAssignment(courseId, assignmentId)
        .then(removed => {
          expect(removed).toBeTruthy();

          return collection.findOne({ _id: ObjectId(courseId) });
        })
        .then(course => {
          let doesCourseStillExist = course.assignments.find(
            assignment => assignment._id.toHexString() === assignmentId.toHexString()
          );

          expect(doesCourseStillExist).toBeFalsy();
        });
    });
  });

  describe('getCourseAssignments()', () => {
    it('returns all assignments for a course identified by id', () => {
      const courseId = coursesSeed[0]._id;
      const expectedAssignments = coursesSeed[0].assignments;

      return courses
        .getCourseAssignments(courseId)
        .then(assignments => expect(assignments).toEqual(expectedAssignments));
    });
  });

  describe('findCourseAssignmentById()', () => {
    it('returns assignment specified by the courseId and assignmentId params given to the function', () => {
      const courseId = coursesSeed[0]._id;
      const assignmentId = coursesSeed[0].assignments[0]._id;
      const expectedAssignment = coursesSeed[0].assignments[0];

      return courses
        .findCourseAssignmentById(courseId, assignmentId)
        .then(assignment => expect(assignment).toEqual(expectedAssignment));
    });
  });
});
