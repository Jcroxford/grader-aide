// used to seed docker dev database
const courseSeed = require('./courses.seed');
const userSeed = require('./users.seed');

const db = require('../db');

function seedUsers() {
  const coursesCollection = db.collection('users');

  return coursesCollection.deleteMany({}).then(() => coursesCollection.insertMany(userSeed));
}

function seedCourses() {
  const coursesCollection = db.collection('courses');

  return coursesCollection.deleteMany({}).then(() => coursesCollection.insertMany(courseSeed));
}

function seedDB() {
  return seedUsers().then(seedCourses);
}

module.exports = seedDB;
