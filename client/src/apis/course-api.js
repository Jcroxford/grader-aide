import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export function createCourse(course, callback) {
  axios
    .post(`${BASE_URL}/api/courses/`, {
      courseName: course.courseName,
      courseId: course.courseId,
      assignments: course.assignments,
      studentsEnrolled: course.studentsEnrolled
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

export function getCourse(id, callback) {
  axios
    .get(`${BASE_URL}/api/courses/${id}`)
    .then(response => response.data)
    .then(callback)
    .catch(callback);
}

export function getAssignment(courseId, assignmentId, callback) {
  axios
    .get(`${BASE_URL}/api/courses/${courseId}/assignment/${assignmentId}`)
    .then(response => response.data)
    .then(callback)
    .catch(callback);
}

export function createAssignment(courseId, assignment, callback) {
  axios
    .post(`${BASE_URL}/api/course/${courseId}/assignment`, {
      name: assignment.name,
      totalPts: assignment.totalPts,
      rules: assignment.rules,
      comments: assignment.comments
    })
    .then(response => response.data)
    .then(callback)
    .catch(callback);
}

export function updateAssignment(courseId, assignment, callback) {
  axios
    .put(`${BASE_URL}/api/courses/${courseId}/assignment/${assignment._id}`, {
      _id: assignment._id,
      name: assignment.assignmentName,
      totalPts: assignment.totalPts,
      rules: assignment.rules,
      comments: assignment.comments
    })
    .then(response => response.data)
    .then(callback)
    .catch(callback);
}

export function deleteCourse(course, callback) {
  axios
    .delete(`${BASE_URL}/api/courses/${course._id}`)
    .then(response => response.data)
    .then(callback)
    .catch(callback);
}

export function deleteAssignment(courseId, assignmentId, callback) {
  axios
    .delete(`${BASE_URL}/api/courses/${courseId}/assignment/${assignmentId}`)
    .then(response => response.data)
    .then(callback)
    .catch(callback);
}
