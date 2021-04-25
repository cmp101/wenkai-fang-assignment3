var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
//MONGO_URL
//MONGODB_URI
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://wenkai:123@cluster0.07oyv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { promiseLibrary: require('bluebird') })
.then(() =>  {
  console.log('connection successfull')
})
.catch((err) => console.error(err));


var user = require('./routes/user');
var post = require('./routes/post');
var comment = require('./routes/comment');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use('/', express.static(path.join(__dirname, 'build')));

app.use('/api/user', user);
app.use('/api/post', post);
app.use('/api/comment', comment);


app.get('*', function(req, res) {
  res.sendFile('index.html', {root: path.join(__dirname, 'build/')});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
