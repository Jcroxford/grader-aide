const router = require('express').Router();

const Courses = require('../models/courses.model');

router.get('/courses', function(req, res, next) {
  Courses.preview()
    .then(res.json.bind(res))
    .catch(err => {
      console.log(err);

      res.status(500).json({ error: 'server error occured while trying to retrieve courses' });
    });
});

router.get('/courses/:id', (req, res) => {
  const { _id } = req.params;

  Courses.findById(_id)
    .then(course => {
      if (!course) res.status(400).json({ error: 'course at given id does not exist' });

      res.json(course);
    })
    .catch(err => {
      console.log(err);

      res.status(500).json({ error: 'server error occured while trying to retrieve courses' });
    });
});

router.post('/courses', (req, res) => {
  Courses.createCourse(req.body)
    .then(_id => {
      res.json({ _id });
    })
    .catch(err => {
      console.log(err);

      res.status(500).json({ error: 'unable to create assignment' });
    });
});

router.delete('/courses/:id', (req, res) => {
  const { _id } = req.params;

  Courses.destroyCourse(_id)
    .then(log)
    .catch(err => {
      console.log(err);

      res.status(500).json({
        error: 'unable to remove assignment'
      });
    });
});

router.put('/courses/:id', (req, res) => {
  const { _id } = req.params;

  Courses.updateCourseById(_id, req.body)
    .then(() => res.status(204).send())
    .catch(err => {
      console.log(err);

      res.status(500).json({
        error: 'unable to udpate assignment'
      });
    });
});

module.exports = router;
