const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const movies = require('./routes/movies');
const directors = require('./routes/directors');

const app = express();

// db connection
const db = require('./helper/db')();

// config
const config = require('./config');
app.set('api_secret_key',config.api_secret_key);

// Middleware
const verifyToken = require('./middleware/verifyToken');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', verifyToken);
app.use('/api/movies', movies);
app.use('/api/directors', directors);

// catch 404 and forward to error handler
app.use((req, res, next) =>  {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err.message, code:err.code });
});

module.exports = app;
