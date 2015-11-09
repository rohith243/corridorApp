var express = require('express');
var cas = require('connect-cas');
var router = express.Router();
var user = require('./modules/user');
//var handleContent = require('./modules/handleContent.js');
router.get('/', cas.ssout('/signin'), cas.serviceValidate(), cas.authenticate(), function(req, res) {
    res.render('dashboard', {
        title: 'Dashboard | LetsBuild',
        editAppTile: true,
        user: user.getDetails(req),
        basePath: './'
    });
});
module.exports = router;
