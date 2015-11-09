var express = require('express');
var cas = require('connect-cas');
var router = express.Router();
var user = require('./modules/user');
//var handleContent = require('./modules/handleContent.js');
router.get('/', cas.ssout('/signin'), cas.serviceValidate(), cas.authenticate(), function(req, res) {
    var udetails = user.getDetails(req);
    if(  udetails.admin  ) {
        res.render('admin', {
            title: 'Admin | LetsBuild',
            user: user.getDetails(req),
            basePath: './'
        });    
    } else {
        res.redirect( './' );
    }
});

router.get('/edit/:_id',cas.ssout('/signin'), cas.serviceValidate(), cas.authenticate(), function(req, res, next) {
    
    var udetails = user.getDetails(req);
    if(  udetails.admin  ) {
        res.render('admin-edit', {
            title: 'Admin Edit | LetsBuild',
            user: user.getDetails(req),
            basePath: '../../'
        });    
    } else {
        res.redirect( './../' );
    }
    
});


module.exports = router;
