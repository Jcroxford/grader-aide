import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export function getAssignments(callback) {
  axios
    .get(`${BASE_URL}/api/assignments`)
    .then(response => response.data)
    .then(callback)
    .catch(callback);
}

export function getAssignment(id, callback) {
  axios
    .get(`${BASE_URL}/api/assignments/${id}`)
    .then(response => response.data)
    .then(callback)
    .catch(callback);
}

export function updateAssignment(assignment, callback) {
  axios
    .put(`${BASE_URL}/api/assignments/${assignment.assignmentID}`, {
      assignmentName: assignment.assignmentName,
      totalPts: assignment.totalPts,
      rules: assignment.rules,
      comments: assignment.comments
    })
    .then(response => response.data)
    .then(callback)
    .catch(callback);
}

export function createAssignment(assignment, callback) {
  axios
    .post(`${BASE_URL}/api/assignments/`, {
      assignmentName: assignment.assignmentName,
      totalPts: assignment.totalPts,
      rules: assignment.rules,
      comments: assignment.comments
    })
    .then(response => response.data)
    .then(callback)
    .catch(callback);
}
