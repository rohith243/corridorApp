var express = require('express');
var router = express.Router();
router.get('/', function(req, res, next) {
     res.render('letsbuild', {
        title: 'Gallary | Letsbuild'
    });
});
router.get('/id/:_id', function(req, res, next) {
    res.render( 'letsbuildapp', {
        title: 'Express Page'
    } );
});

module.exports = router;
