var express = require('express');
var router = express.Router();
var handleContent = require('./modules/handleContent.js');
router.get('/', function(req, res, next) {
    
    res.render( 'letsbuild', {
        title: 'Gallary | Letsbuild'
    } );
    /*handleContent.cachecontent(req, res, next, {
        template: 'letsbuild',
        data: {
            title: 'Express Page'
        }
    });*/
});



/*router.get('/clearcache', function(req, res, next) {
    handleContent.originalContent(req, res, next, {
        template: 'letsbuild',
        data: {
            title: 'Express Page'
        }
    });
});*/
router.get('/id/:_id', function(req, res, next) {
    handleContent.cachecontent(req, res, next, {
        template: 'letsbuildapp',
        data: {
            title: 'Express Page'
        }
    });
});
router.get('/id/:_id/clearcache', function(req, res, next) {
    handleContent.originalContent(req, res, next, {
        template: 'letsbuildapp',
        data: {
            title: 'Express Page'
        }
    });
});

module.exports = router;
