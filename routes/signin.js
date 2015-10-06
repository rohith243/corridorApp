var express = require('express');
var router = express.Router();
var cas = require('connect-cas');

router.get('/', cas.ssout('/edit/:_id'), cas.serviceValidate(), cas.authenticate(), function(req, res, next) { 
	var redirect = req.query.redirect || 'http://localhost:3000/'
    res.redirect( redirect );
});
module.exports = router;
