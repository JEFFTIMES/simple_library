var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog');
const aboutMeRouter = require('./routes/aboutme')

var app = express();

//setup database connections
var mogoose = require('mongoose'); //import mongoose driver
var mongoDB = 'mongodb://localhost:27017/local_library'; //setup database uri string
var mongoAtlas = 'mongodb+srv://jsong:js0ng@cluster0.czj9j.mongodb.net/admin?authSource=admin&replicaSet=atlas-10j4xh-shard-0&w=majority&readPreference=primary&retryWrites=true&ssl=true'

//create db connections
//use mongDB for localhost connections, use mongoAtlas for atlas connections.
//the {useNewUrlParser:true, useUnifiedTopology:true, use} option should be used.
mogoose.connect(mongoDB,{useNewUrlParser:true, useUnifiedTopology:true});
var db = mogoose.connection;
db.on('error', function (){
  console.error.bind(console,'MongoDB connection error.');
})





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);
app.use('/aboutMe', aboutMeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
