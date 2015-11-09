var express = require('express');
var cas = require('connect-cas');
var user = require('./modules/user');
var router = express.Router();
router.get('/',  function(req, res, next) {
    if( user.getDetails( req ) ) {
        res.render('propose-form', {
            title: 'Proposal | LetsBuild',
            user: user.getDetails(req),
            basePath: './'
        });    
    } else {
        res.redirect( './../signin?redirect=/' );
    }
    
});
module.exports = router;
