import axiosBase from '@/utils/requestBase';

// COURSES
// CREATE
export function createCourse(course, callback) {
  axiosBase()
    .post('/api/courses/', {
      courseName: course.courseName,
      courseId: course.courseId,
      assignments: course.assignments,
      studentsEnrolled: course.studentsEnrolled
    })
    .then(response => response.data)
    .then(callback)
    .catch(callback);
}

// READ
export function getCourses(callback) {
  axiosBase()
    .get('/api/courses')
    .then(response => response.data)
    .then(callback)
    .catch(callback);
}

export function getCourse(id, callback) {
  axiosBase()
    .get(`/api/courses/${id}`)
    .then(response => response.data)
    .then(callback)
    .catch(callback);
}

// UPDATE
export function updateCourse(course, callback) {
  axiosBase()
    .put(`/api/courses/${course._id}`, {
      courseName: course.courseName,
      courseId: course.courseId,
      assignments: course.assignments,
      studentsEnrolled: course.studentsEnrolled
    })
    .then(response => response.data)
    .then(callback)
    .catch(callback);
}

// DELETE
export function deleteCourse(course, callback) {
  axiosBase()
    .delete(`/api/courses/${course._id}`)
    .then(response => response.data)
    .then(callback)
    .catch(callback);
}

// ASSIGMENTS
// CREATE
export function createAssignment(courseId, assignment, callback) {
  axiosBase()
    .post(`/api/course/${courseId}/assignment`, {
      name: assignment.name,
      totalPts: assignment.totalPts,
      rules: assignment.rules,
      comments: assignment.comments
    })
    .then(response => response.data)
    .then(callback)
    .catch(callback);
}

// READ
export function getAssignment(courseId, assignmentId, callback) {
  axiosBase()
    .get(`/api/courses/${courseId}/assignment/${assignmentId}`)
    .then(response => response.data)
    .then(callback)
    .catch(callback);
}

// UPDATE
export function updateAssignment(courseId, assignment, callback) {
  axiosBase()
    .put(`/api/courses/${courseId}/assignment/${assignment._id}`, {
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

// DELETE
export function deleteAssignment(courseId, assignmentId, callback) {
  axiosBase()
    .delete(`/api/courses/${courseId}/assignment/${assignmentId}`)
    .then(response => response.data)
    .then(callback)
    .catch(callback);
}
