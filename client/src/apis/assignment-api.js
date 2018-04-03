import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

// export function generateID() {
//   let s = [];
//   let hexDigits = '0123456789abcdef';
//   for (var i = 0; i < 36; i++) {
//     s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
//   }
//   s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
//   s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
//   s[8] = s[13] = s[18] = s[23] = '-';
//   return s.join('');
// }

export function getAssignments(callback) {
  axios
    .get(`${BASE_URL}/api/assignments`)
    .then(function(response) {
      callback(response.data);
    })
    .catch(function(error) {
      console.log(error);
    });
}

export function getAssignment(id, callback) {
  axios
    .get(`${BASE_URL}/api/assignments/${id}`)
    .then(function(response) {
      callback(response.data);
    })
    .catch(function(error) {
      console.log(error);
    });
}

export function updateAssignment(assignment, callback) {
  console.log('BASE_URL: ', BASE_URL);

  axios
    .put(`${BASE_URL}/api/assignments/${assignment.assignmentID}`, {
      assignmentName: assignment.assignmentName,
      totalPts: assignment.totalPts,
      rules: assignment.rules,
      comments: assignment.comments
    })
    .then(function(response) {
      callback(response);
    })
    .catch(function(error) {
      console.log(error);
    });
}

export function createAssignment(assignment, callback) {
  console.log('BASE_URL: ', BASE_URL);

  axios
    .post(`${BASE_URL}/api/assignments/`, {
      assignmentName: assignment.assignmentName,
      totalPts: assignment.totalPts,
      rules: assignment.rules,
      comments: assignment.comments
    })
    .then(function(response) {
      callback(response);
    })
    .catch(function(error) {
      console.log(error);
    });
}
