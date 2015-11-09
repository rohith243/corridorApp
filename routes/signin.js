var express = require('express');
var router = express.Router();
var cas = require('connect-cas');
router.get('/', cas.ssout('/signin'), cas.serviceValidate(), cas.authenticate(), function(req, res, next) {
    var redirect = req.query.redirect || '.';
    res.redirect(redirect);
});


module.exports = router;
