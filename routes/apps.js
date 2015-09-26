var express = require('express');
var router = express.Router();
var handleContent = require('./modules/handleContent.js');
router.get('/', function(req, res, next) {
    handleContent.cachecontent(req, res, next, {
        template: 'apps',
        data: {
            title: 'Express Page'
        }
    });
});
router.get('/clearcache', function(req, res, next) {
    handleContent.originalContent(req, res, next, {
        template: 'apps',
        data: {
            title: 'Express Page'
        }
    });
});
module.exports = router;
