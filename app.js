var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var marked = require('marked');

// This option isn't needed right now -- does nothing
marked.setOptions({
    gfm: true
});

var routes = require('./routes/index');
var step1 = require('./routes/step1');
var step2 = require('./routes/step2');
var step3 = require('./routes/step3');
var step4 = require('./routes/step4');
var step5 = require('./routes/step5');
var step6 = require('./routes/step6');
var step7 = require('./routes/step7');
var step8 = require('./routes/step8');
var step9 = require('./routes/step9');
var step10 = require('./routes/step10');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/step1', step1);
app.use('/step2', step2);
app.use('/step3', step3);
app.use('/step4', step4);
app.use('/step5', step5);
app.use('/step6', step6);
app.use('/step7', step7);
app.use('/step8', step8);
app.use('/step9', step9);
app.use('/step10', step10);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
