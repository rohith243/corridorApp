var express = require('express');
var cas = require('connect-cas');
var router = express.Router();
var user = require('./modules/user');

router.get('/', cas.ssout('/protected'), cas.serviceValidate(), cas.authenticate(), function(req, res) {    
    var udetails = user.getDetails(req);
    if(  udetails.admin  ) {
        res.render('feature-config', {
            title: 'Admin | feature config',
            user: user.getDetails(req),
            basePath: './'
        });    
    } else {
        res.redirect( './' );
    }
});
module.exports = router;
