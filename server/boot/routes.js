module.exports = function(app) {

    var user = require( '../../modules/user' );

    app.get('/', function( req, res, next ) {
    
       res.render('home', {
            title: 'Home | LetsBuild',
            user: user.getDetails( req ),
            basePath: './'
        });
    
    });

    var cas = require('connect-cas');
    app.get('/signin', cas.ssout('/protected'), cas.serviceValidate(), cas.authenticate(), function(req, res, next) {
    
        var redirect = req.query.redirect || '.';
        res.redirect(redirect);
    
    });

    app.post('/signin', function(req, res, next) {
        
        var body = '';
        req.on('data', function(chunk){
            body += chunk;
        });
        req.on('end', function(){
           
            body = decodeURIComponent( body );
            if (!/<samlp:SessionIndex>(.*)<\/samlp:SessionIndex>/.exec(body)) {
                next();
                return;
            }
            var st = RegExp.$1;
            var sessionId = req.sessionStore.sessions[ st ];
            if( sessionId ) {
              sessionId = JSON.parse( sessionId );
              if( sessionId ) {
                if ( sessionId && sessionId.sid ) req.sessionStore.destroy( sessionId.sid );
                req.sessionStore.destroy(st);  
              }
            }
            res.send(204);
        });
    
    });

    app.get('/services/logout', function(req, res, next) {
        
        if (req.session.destroy) {
            req.session.destroy();
        } else {
            req.session = null;
        }
        res.end( '' );

    });

}