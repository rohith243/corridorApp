var express = require('express');
var cas = require('connect-cas');
var router = express.Router();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


//var handleContent = require('./modules/handleContent.js');

router.get('/', cas.ssout('/protected'), cas.serviceValidate(), cas.authenticate(), function(req, res) {
  
    res.render( 'dashboard', {
        title: 'Dashboard | Letsbuild',
        editAppTile: true
    } );
});




module.exports = router;
