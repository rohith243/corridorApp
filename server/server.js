var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');
var session = require('express-session');
var app = module.exports = loopback();

var cas = require('connect-cas');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
cas.configure({ 
    host: 'cev3.pramati.com',
    protocol:'https',
    paths: {
        validate: '/cas/validate', 
        serviceValidate: '/cas/p3/serviceValidate', // CAS 3.0
        proxyValidate: '/cas/p3/proxyValidate', // CAS 3.0
        proxy: '/cas/proxy',
        login: '/cas/login',
        logout: '/cas/logout'
    }
});
app.sessionMiddleware = session({secret: 'corridorApp'});
app.use( app.sessionMiddleware );
app.use(function(req, res, next) {
  if( process.env.NODE_ENV === 'production' ) {
    req.headers.host = "cev3.pramati.com/letsbuild";
  }
  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

boot(app, __dirname, function(err) {
  if (err) throw err;
  // start the server if `$ node server.js`
  if (require.main === module)
    {
      var appSocket = require( './app-socket' );
      appSocket.init( app, app.start() );      
    }
});
