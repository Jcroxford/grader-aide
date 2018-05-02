const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

// controllers/routes
const courseRouter = require('./routes/course.routes.js');
const authRouter = require('./routes/auth.routes');

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

module.exports = app;
