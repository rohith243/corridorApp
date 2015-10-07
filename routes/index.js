var express = require('express');
var router = express.Router();
var user = require('./modules/user');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Home1 | Letsbuild',
        user : user.getDetails( req )
    });
});


module.exports = router;
