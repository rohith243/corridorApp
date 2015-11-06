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

    app.get('/services/signout', function(req, res, next) {
        
        if (req.session.destroy) {
            req.session.destroy();
        } else {
            req.session = null;
        }
        res.end( '' );

    });

}