import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export function createCourse(course, callback) {
  axios
    .post(`${BASE_URL}/api/courses/`, {
      courseName: course.courseName,
      courseId: course.courseId
    })
    .then(response => response.data)
    .then(callback)
    .catch(callback);
}

export function getCourses(callback) {
  axios
    .get(`${BASE_URL}/api/courses`)
    .then(response => response.data)
    .then(callback)
    .catch(callback);
}

// export function getAssignment(id, callback) {
//   axios
//     .get(`${BASE_URL}/api/assignments/${id}`)
//     .then(response => response.data)
//     .then(callback)
//     .catch(callback);
// }

// export function updateAssignment(assignment, callback) {
//   axios
//     .put(`${BASE_URL}/api/assignments/${assignment.assignmentID}`, {
//       assignmentName: assignment.assignmentName,
//       totalPts: assignment.totalPts,
//       rules: assignment.rules,
//       comments: assignment.comments
//     })
//     .then(response => response.data)
//     .then(callback)
//     .catch(callback);
// }
