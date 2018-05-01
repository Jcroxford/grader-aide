const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

// controllers/routes
const assignmentRouter = require('./routes/assignment.routes.js');
const courseRouter = require('./routes/course.routes.js');
const authRouter = require('./routes/auth.routes');

// db
const db = require('./db');

// load .env variables
require('./config/config');

// auth middleware
const passport = require('./services/passport');

let app = express();

// middleware
app.use(helmet());
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(express.static('public'));

// routes
app.use('/api/auth', authRouter);
app.use('/api', courseRouter);

const port = process.env.PORT || 3001;

db
  .connect()
  .then(() => {
    console.log('\nconnection to database established\n');

    if (process.env.NODE_ENV === 'development') {
      const seedDB = require('./seed/seedDevServer');

      return seedDB().then(() => console.log('dev server has been reseeded successfully\n'));
    }
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Listening on http://localhost:${port}\n`);
    });
  })
  .catch(err => {
    console.log('\nUnable to establish connection to the database\n');
    console.log(err);
    process.exit(1);
  });
