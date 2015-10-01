var express = require('express');
var router = express.Router();
router.get('/', function(req, res, next) {
    res.render('propose-form', {
        title: 'Propose form'
    });
});


router.get('/edit/:_id', function(req, res, next) {    
    res.render( 'propose-form-edit', {
        title: 'Edit  | Letsbuild'
    } );
});


module.exports = router;
