const db = require('../db');

async function getAssignments() {
  const collection = db.collection('assignments');

  return await collection.find({}).toArray();
}

async function getAssignmentById(_id) {
  const collection = db.collection('assignments');

  return await collection.findOne({ _id });
}

async function createAssignment(assignment) {
  const collection = db.collection('assignments');

  const { result, insertedId } = await collection.insertOne(assignment);

  if (!result.ok) throw new Error('unable to save assignment');

  return insertedId;
}

module.exports = { getAssignments, getAssignmentById, createAssignment };
