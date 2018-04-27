/**
 * This is how a course looks
 * @param {string} _id - unique
 * @param {string} courseName
 * @param {string} courseId - e.g. cs4690
 * @param {object[]} assignments see assignment object definition below
 * @param {string[]} studentsEnrolled - ids of enrolled students
 */

/**
 * This is the look of an assignment object
 * @param {string} _id - unique
 * @param {string} name
 * @param {number} totalPts
 * @param {object[]} rules takes the form { _id {string} is unique, pts {number}, desc {string} }
 * @param {object[]} comments takes the form { _id {string} is unique, desc {string} }
 */
const db = require('../db');
const ObjectId = require('mongodb').ObjectID;

function preview() {
  const collection = db.collection('courses');

  return collection
    .find({})
    .project({ courseName: 1, courseId: 1 })
    .toArray();
}

function findById(_id) {
  const collection = db.collection('courses');

  return collection.findOne({ _id: ObjectId(_id) });
}
// create a new course
function createCourse(course) {
  const collection = db.collection('courses');

  return collection.insertOne(course).then(({ result, insertedId }) => {
    if (!result.ok) throw new Error('unable to save course');

    return insertedId;
  });
}

function destroyCourse(_id) {
  const collection = db.collection('courses');

  return collection.deleteOne({ _id: ObjectId(_id) }).then(({ deletedCount }) => deletedCount);
}

function createAssignment(courseId, assignment) {
  const collection = db.collection('courses');

  return collection
    .findOneAndUpdate({ _id: ObjectId(courseId) }, { $push: { assignments: assignment } })
    .then(({ ok }) => ok);
}

// required entire assignment atm
function updateAssignment(courseId, assignmentId, updatedAssignment) {
  const collection = db.collection('courses');

  const match = {
    _id: ObjectId(courseId),
    'assignments._id': ObjectId(assignmentId)
  };

  const updates = {
    $set: {
      'assignments.$': updatedAssignment
    }
  };

  return collection.findOneAndUpdate(match, updates).then(({ ok }) => ok);
}

function destroyAssignment(courseId, assignmentId) {
  const collection = db.collection('courses');

  return collection
    .findOneAndUpdate(
      { _id: ObjectId(courseId) },
      { $pull: { assignments: { _id: ObjectId(assignmentId) } } }
    )
    .then(({ ok }) => ok);
}
// delete an assignment from a acourse
// get all assignments for a course (name and id only?)
// get a signle assingment from a course by id for both assignment and course
// get students enrolled in a course
// add a student

module.exports = {
  preview,
  findById,
  createCourse,
  destroyCourse,
  createAssignment,
  updateAssignment,
  destroyAssignment
};
