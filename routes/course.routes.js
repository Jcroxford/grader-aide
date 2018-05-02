const router = require('express').Router();

const Courses = require('../models/courses.model');

router.post('/courses', (req, res) => {
  Courses.createCourse(req.body)
    .then(id => {
      res.json({ id });
    })
    .catch(err => {
      console.log(err);

      res.status(500).json({ error: 'unable to create assignment' });
    });
});

router.get('/courses', function(req, res, next) {
  Courses.preview()
    .then(res.json.bind(res))
    .catch(err => {
      console.log(err);

      res.status(500).json({ error: 'server error occured while trying to retrieve courses' });
    });
});

router.get('/courses/:id', (req, res) => {
  const { id } = req.params;

  Courses.findById(id)
    .then(course => {
      if (!course) return res.status(400).json({ error: 'course at given id does not exist' });
      res.json(course);
    })
    .catch(err => {
      console.log(err);

      res.status(500).json({ error: 'server error occured while trying to retrieve courses' });
    });
});

router.get('/courses/:courseId/assignment/:assignmentId', (req, res) => {
  const { courseId, assignmentId } = req.params;

  Courses.findCourseAssignmentById(courseId, assignmentId)
    .then(assignment => {
      if (!assignment)
        return res.status(400).json({ error: 'assignment at given id does not exist' });
      res.json(assignment);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'server error occured while trying to retrieve assignments' });
    });
});

router.delete('/courses/:id', (req, res) => {
  const { id } = req.params;

  Courses.destroyCourse(id)
    .then(() => res.status(200).send())
    .catch(err => {
      console.log(err);

      res.status(500).json({ error: 'unable to remove assignment' });
    });
});

router.delete('/courses/:courseId/assignment/:assignmentId', (req, res) => {
  const { courseId, assignmentId } = req.params;

  Courses.destroyAssignment(courseId, assignmentId)
    .then(() => res.status(200).send())
    .catch(err => {
      console.log(err);

      res.status(500).json({ error: 'unable to remove assignment' });
    });
});

router.put('/courses/:id', (req, res) => {
  const { id } = req.params;

  Courses.updateCourseById(id, req.body)
    .then(() => res.status(204).send())
    .catch(err => {
      console.log(err);

      res.status(500).json({
        error: 'unable to udpate assignment'
      });
    });
});

router.put('/courses/:courseId/assignment/:assignmentId', (req, res) => {
  const { courseId, assignmentId } = req.params;

  Courses.updateAssignment(courseId, assignmentId, req.body)
    .then(() => res.status(204).send())
    .catch(err => {
      console.log(err);

      res.status(500).json({ error: 'unable to udpate assignment' });
    });
});

//assignment create @ courseId
router.post('/course/:courseId/assignment', (req, res) => {
  const { courseId } = req.params;
  Courses.createAssignment(courseId, req.body)
    .then(id => {
      res.json({ id });
    })
    .catch(err => {
      console.log(err);

      res.status(500).json({ error: 'unable to create assignment' });
    });
});

module.exports = router;