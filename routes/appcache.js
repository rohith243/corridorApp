var express = require('express');
var router = express.Router();
router.get('/', function(req, res, next) {
    res.render('propose-form', {
        title: 'Proposal | LetsBuild',
        user: user.getDetails(req),
        basePath: './'
    });
});
module.exports = router;
