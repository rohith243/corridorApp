var express = require('express');
var router = express.Router();
//var mongo = require('./mongo-db/index.js');
//var JSONStream = require( 'JSONStream' );
/* GET users listing. */
/*router.get('/', function(req, res, next) {
	
	mongo.connect( function( err, db ) {
		
		if ( err ) {
		    res.send( 'Unable to connect to the mongoDB server. Error:', err );
		}

		var cursor = mongo.find( {
			db: db,
			collectionName: 'appstore'
		} );
	    cursor.stream().pipe( JSONStream.stringify() ).pipe( res );

	} );

});*/
router.get('/', function(req, res, next) {
    res.render('admin', {
        title: 'Express'
    });
});
module.exports = router;
