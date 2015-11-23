var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');
var session = require('express-session');
var http = require('http');
var https = require('https');
var sslConfig = require('./ssl-config');
var app = module.exports = loopback();

var cas = require('connect-cas');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
cas.configure({ 'host': 'cev3.pramati.com',protocol:'https',
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


app.start = function(httpOnly) {
  if(httpOnly === undefined) {
    httpOnly = process.env.HTTP;
  }
  var server = null;
  if(!httpOnly) {
    var options = {
      key: sslConfig.privateKey,
      cert: sslConfig.certificate
    };
    server = https.createServer(options, app);
  } else {
    server = http.createServer(app);
  }
  server.listen(app.get('port'), function() {
    var baseUrl = (httpOnly? 'http://' : 'https://') + app.get('host') + ':' + app.get('port');
    app.emit('started', baseUrl);
    console.log('LoopBack server listening @ %s%s', baseUrl, '/');
  });
  return server;
};

// boot scripts mount components like REST API
boot(app, __dirname, function(err) {
  if (err) throw err;
  // start the server if `$ node server.js`
  if (require.main === module)
    {
      var appSocket = require( './app-socket' );
      appSocket.init( app, app.start( true ) );      
    }
});
