var express = require('express');
var router = express.Router();
var user = require('./modules/user');
router.get('/', function(req, res, next) {
    res.render('gallery', {
        title: 'Gallery | LetsBuild',
        user: user.getDetails(req),
        basePath: './../'
    });
});
router.get('/id/:_id', function(req, res, next) {
    res.render('app-details', {
        title: 'App Details | LetsBuild',
        user: user.getDetails(req),
        basePath: './../../../'
    });
});
module.exports = router;
