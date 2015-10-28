var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var dbname = 'corridorApp';
var dbHost = process.env.DB_HOST ? process.env.DB_HOST : 'localhost';
var url = 'mongodb://'+dbHost+':27017/';
var mongo = {};
var user = require('./../modules/user');
mongo.connect = function(obj) {
    var connectUrl = url + (obj.dbname || +dbname);
    MongoClient.connect(connectUrl, function( err, db ) {
        if( err ) {
            console.log( 'Mongo connection error' );
            if( obj.res ) {
                obj.res.statusCode = 500;
                obj.res.json( {
                    'error': '_error_mongo'
                } );
                return;
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
                obj.res.statusCode = 500;
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
                obj.res.statusCode = 500;
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
            if( obj.res ) {
                obj.res.statusCode = 500;
                obj.res.json({
                    'error': '_error_mongo'
                });
                return;    
            }
            
        }
        obj.callback( err, doc );
    } );  
};


mongo.authorizedUser = function ( obj ) {
    console.log( 'authorizedUser' );
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
                    console.log( 'before check' );
                    if( user.checkMail( obj.req, doc.owner.mail ) ) {
                        console.log( 'checkMail' );
                        obj.callback( obj );
                        console.log( 'end---------------end' );
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
