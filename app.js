var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cas = require('connect-cas');



process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

cas.configure({ 'host': 'cev3.pramati.com',
paths: {
        validate: '/cas/validate', 
        serviceValidate: '/cas/p3/serviceValidate', // CAS 3.0
        proxyValidate: '/cas/p3/proxyValidate', // CAS 3.0
        proxy: '/cas/proxy',
        login: '/cas/login',
        logout: '/cas/logout'
    }
});

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'corridorApp'}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.use('/apps', require( './routes/apps' ) );
app.use('/letsbuild', require( './routes/letsbuild' ) );
app.use('/dashboard', require( './routes/dashboard' ) );
app.use('/signin', require( './routes/signin' ) );


app.use('/admin', require( './routes/admin' ) );
app.use('/services', require( './routes/services' ) );
app.use('/propose-form', require( './routes/propose-form' ) );





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
