var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var dbname = 'corridorApp';
var url = 'mongodb://localhost:27017/';
var mongo = {};
var user = require('./../modules/user');
mongo.connect = function(obj) {
    var connectUrl = url + (obj.dbname || +dbname);
    MongoClient.connect(connectUrl, function( err, db ) {
        if( err ) {
            console.log( 'mongo connection error' );
            if( obj.res ) {
                obj.res.json( {
                    'error': '_error_mongo'
                } );
            }
        }
        
        obj.callback( err, db );
    });
       
};
mongo.getCollection = function(obj) {
    obj.db.collection(obj.collectionName, obj.callback);
};
mongo.find = function(obj) {
    var query = obj.query || {};
    var proj = obj.projection || {};
    return obj.db.collection(obj.collectionName ).find( query, proj );
};
mongo.findOne = function( obj ) {
    
    var query = obj.query || {};
    var projection = obj.projection || {};
    obj.collection.findOne( query, projection, function (  err, doc ) {
        if( err )  {
            if( obj.res ) {
                obj.res.json( {
                    'error': '_error_mongo'
                } );
            }
        }
        obj.callback( err, doc );
    } );
};

mongo.remove = function ( obj ) {
  var query = obj.query || {};
    obj.collection.remove( query, function (  err, doc ) {
        if( err )  {
            if( obj.res ) {
                obj.res.json( {
                    'error': '_error_mongo'
                } );
            }
        }
        obj.callback( err, doc );
    } );  
};



mongo.update = function ( obj ) {
    var query = obj.query || {};
    obj.collection.update( query, obj.setData, function(err, doc) {
        if (err) {
            obj.json({
                'error': '_error_mongo'
            });
            return;
        }
        obj.callback( err, doc );
    } );  
};


mongo.authorizedUser = function ( obj ) {
    
    mongo.connect( {
        res: obj.res,
        callback: function( err, db ) {
            obj.db = db;
            var collection = db.collection( obj.collectionName );
            obj.collection = collection;
            mongo.findOne( {
                res: obj.res,
                query: obj.query,
                collection: collection,
                callback: function  ( err, doc ) {
                    if( !doc ) {
                        obj.res.json( {
                            error: '_item_not_found'
                        } );
                        db.close();
                        return;
                    }
                    if( user.checkMail( obj.req, doc.owner.mail ) ) {
                        obj.callback( obj );
                    } else {
                        obj.res.statusCode = 403;
                        obj.res.json( {
                            error: '_unauthorised_user'
                        } );
                    }
                }
            } );
        }
    } );
};
module.exports = mongo;
