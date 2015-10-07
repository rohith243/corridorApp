var express = require('express');
var cas = require('connect-cas');

var user = require('./modules/user');
var router = express.Router();


router.get('/', cas.ssout('/'), cas.serviceValidate(), cas.authenticate(), function(req, res, next) {
    res.render('propose-form', {
        title: 'Propose form',
        user : user.getDetails( req )
    });
});

router.get('/edit/:_id', cas.ssout('/edit/:_id'), cas.serviceValidate(), cas.authenticate(), function(req, res, next) { 
    res.render( 'propose-form-edit', {
        title: 'Edit  | Letsbuild',
        user : user.getDetails( req )
    } );
});


module.exports = router;
