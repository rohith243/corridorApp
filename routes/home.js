var express = require('express');
var router = express.Router();
var user = require('./modules/user');
/* GET home page. */
router.get('/', function(req, res, next) {   

    res.render('home', {
        title: 'Home | LetsBuild',
        user: user.getDetails(req),
        basePath: './'
    });
});
module.exports = router;
