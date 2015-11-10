var express = require('express');
var router = express.Router();
var cas = require('connect-cas');
router.get('/', cas.ssout('/signin'), cas.serviceValidate(), cas.authenticate(), function(req, res, next) {
    var redirect = req.query.redirect || '.';
    res.redirect(redirect);
});

/*signout from session if the user is signed out from the cas session*/
router.post('/', function(req, res, next) {
    var logoutRequest = req.body.logoutRequest;
    if (!/<samlp:SessionIndex>(.*)<\/samlp:SessionIndex>/.exec(logoutRequest)) {
        next();
        return;
    }
    var st = RegExp.$1;
    var sessionId = req.sessionStore.sessions[ st ];
    if( sessionId ) {
      sessionId = JSON.parse( sessionId );
      if( sessionId ) {
        if ( sessionId && sessionId.sid ) req.sessionStore.destroy( sessionId.sid );
        req.sessionStore.destroy(st);  
      }
    }
    res.send(204); 
});
module.exports = router;
