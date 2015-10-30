var express = require('express');
var cas = require('connect-cas');
var router = express.Router();
var user = require('./modules/user');

router.get('/', cas.ssout('/'), cas.serviceValidate(), cas.authenticate(), function(req, res) {
    var udetails = user.getDetails(req);
    if(  udetails.admin  ) {
        res.render('site-config', {
            title: 'Admin | site config',
            user: user.getDetails(req),
            basePath: './',
            siteConfig: user.getConfig()
        });    
    } else {
        res.redirect( './' );
    }
});
module.exports = router;
