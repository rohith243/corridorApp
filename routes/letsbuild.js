var express = require('express');
var router = express.Router();
var user = require('./modules/user');
router.get('/', function(req, res, next) {
     res.render('letsbuild', {
        title: 'Gallary | Letsbuild',
        user : user.getDetails( req )
    });
});
router.get('/id/:_id', function(req, res, next) {
    res.render( 'letsbuildapp', {
        title: 'Express Page',
        user : user.getDetails( req )
    } );
});

module.exports = router;
