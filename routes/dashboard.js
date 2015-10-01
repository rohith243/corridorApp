var express = require('express');
var router = express.Router();
var handleContent = require('./modules/handleContent.js');
router.get('/', function(req, res, next) {
    
    res.render( 'dashboard', {
        title: 'Dashboard | Letsbuild'
    } );
    /*handleContent.cachecontent(req, res, next, {
        template: 'letsbuild',
        data: {
            title: 'Express Page'
        }
    });*/
});


module.exports = router;
