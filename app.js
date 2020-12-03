const createError = require('http-errors');
const express = require('express');
let path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index.js');
const adminRouter = require('./routes/admin.js');
const studentRouter = require('./routes/student.js');
const teacherRouter = require('./routes/teacher.js');

const app = express();

app.set('views', path.join(__dirname, 'views'));

app.engine('html', require('express-art-template'));
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/teacher', teacherRouter);
app.use('/student', studentRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
