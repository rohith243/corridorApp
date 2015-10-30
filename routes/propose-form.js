var express = require('express');
var cas = require('connect-cas');
var user = require('./modules/user');
var router = express.Router();
router.get('/', cas.ssout('/'), cas.serviceValidate(), cas.authenticate(), function(req, res, next) {
    res.render('propose-form', {
        title: 'Proposal | LetsBuild',
        user: user.getDetails(req),
        basePath: './'
    });
});
module.exports = router;
