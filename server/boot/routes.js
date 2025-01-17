module.exports = function(app) {

    var user = require( '../../modules/user' );
    
    app.get('/', function( req, res, next ) {
    
       res.render('home', {
            title: 'Home | Let\'s Build',
            user: user.getDetails( req ),
            basePath: './',
            stringify: JSON.stringify
        });
    
    });

    var cas = require('connect-cas');
    app.get('/signin', cas.ssout('/signin'), cas.serviceValidate(), cas.authenticate(), function(req, res, next) {
        var redirect = req.query.redirect || '.';
        res.redirect(redirect);    
    });
    app.post('/signin', cas.ssout( '/signin' ) );
    

    app.get('/services/logout', function(req, res, next) {
        
        if (req.session.destroy) {
            req.session.destroy();
        } else {
            req.session = null;
        }
        res.end( '' );

    });

    app.get('/services/getSiteConfig', function(req, res, next) {
        var udetails =  user.getDetails( req );
        if( !udetails || udetails&&!udetails.admin) {
            res.statusCode = '403';
            res.json( {
                error: udetails ? '_not_loggedin' : '_unauthorized_user'
            } );
            return;
        }
        
        res.json( user.getConfig() );
    });

    app.get('/services/checksignin', function(req, res, next) {
        var udetails =  user.getDetails( req );
        if( !udetails ) {
            res.statusCode = '403';
            res.json( {
                error: '_not_loggedin'
            } );
            return;
        }
        
        res.json( '' );
    });



    var bodyParser = require('body-parser');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.post('/signin', cas.ssout('/signin') );

    app.post('/services/updateSiteConfig', function(req, res, next) {
        var udetails =  user.getDetails( req );
        
        if( !udetails || udetails&&!udetails.admin) {
            res.statusCode = '403';
            res.json( {
                error: udetails ? '_unauthorized_user' : '_not_loggedin'
            } );
            return;
        }

        user.setConfig( {
            res: res,
            data: req.body.data,
            callback : function() {
                res.end( '' ); 
            }
        } );
    });
    /*app.post('/signin', function(req, res, next) {
        
        var logoutRequest = req.body.logoutRequest;
        if (!/<samlp:SessionIndex>(.*)<\/samlp:SessionIndex>/.exec(logoutRequest)) {
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
        res.sendStatus(204);
    });*/

    
}