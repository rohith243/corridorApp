var express = require('express');
var router = express.Router();
var user = require('./modules/user');
router.get('/', function(req, res, next) {
    res.render('aboutus', {
        title: 'AboutUs',
        user: user.getDetails(req),
        basePath: './'
    });
});
module.exports = router;