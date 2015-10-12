var express = require('express');
var router = express.Router();
var mongo = require('./mongo-db/index.js');
var JSONStream = require('JSONStream');
var ObjectId = require('mongodb').ObjectID;
var user = require('./modules/user');
var siteUtils = require('./modules/site-utils');
var collectionName = 'letsbuild';

router.get( '/publishedApps', function ( req, res, next ) {
    mongo.connect({
        res: res,
        callback: function(err, db) {
            var proj = {}; 
            try {
                proj = JSON.parse( req.query.projection );
            } catch( e ) {

            }

            var obj = {
                db: db,
                collectionName: collectionName,
                query: {
                    isPublish: true
                },
                projection: proj
            };

            var cursor = mongo.find(obj);
            cursor.stream().pipe(JSONStream.stringify()).pipe(res);
        }
    });      
} );

router.get( '/myProposedApps', function ( req, res, next ) {
    
    var udetails = user.getDetails( req );
    if( ! ( udetails && udetails.mail ) ) {
        req.json( {
            error: '_invalid_user'
        } );
        return;
    }

    mongo.connect({
        res: res,
        callback: function(err, db) {
            var proj = {}; 
            try {
                proj = JSON.parse( req.query.projection );
            } catch( e ) {

            }

            var obj = {
                db: db,
                collectionName: collectionName,
                query: {
                    'owner.mail' : udetails.mail
                },
                projection: proj
            };
            var cursor = mongo.find( obj );
            cursor.stream().pipe(JSONStream.stringify()).pipe(res);
        }
    });
} );

router.post( '/addDocument', function ( req, res, next ) {
    var udetails = user.getDetails( req );
    if( ! ( udetails && udetails.mail ) ) {
        req.json( {
            error: '_invalid_user'
        } );
        return;
    }
    mongo.connect( {
        res: res,
        callback: function(err, db) {
            
            var data = req.body.data;
            var setObj = siteUtils.getSetObject( data, collectionName, data.isPublish );
            /*
            if( !( setObj.errorFields && setObj.errorFields.length ) ) {
                console.log( '_missing_required fields' + setObj.errorFields );
                res.statusCode = 400;
                res.json( {
                    error: '_missing_required'
                } );
                db.close();
                return;
            }*/

            setObj.createdAt = +new Date();
            setObj.owner =  {
                uid: udetails.uid,
                firstName: udetails.firstName,
                lastName: udetails.lastName,
                mail: udetails.mail
            };
            var collection = db.collection( collectionName );
            collection.insert(setObj, function(err, doc) {
                if ( err ) {
                    console.log({
                        'error': '_error_mongo'
                    });
                    return;
                }
                res.json( setObj );
                db.close();
            });
        }
    });
} );

router.get('/getDocument', function ( req, res, next ) {
    
    var query = req.query;
    var oid =  ObjectId( query._id );
    mongo.connect( {
        res: res,
        callback: function( err, db ) {
            var collection = db.collection( collectionName );
            var proj = {};
             try {
                proj = JSON.parse( req.query.projection );
            } catch( e ) {

            }
            mongo.findOne( {
                res: res,
                query: {
                    _id: oid
                },
                projection: proj,
                collection: collection,
                callback: function  ( err, doc ) {
                    if( !doc ) {
                        res.json( doc );
                        db.close();
                        return;
                    }

                    if( doc.isPublish ) {
                        
                        res.json(doc);
                    
                    } else {

                        if( user.checkMail( req, doc.owner.mail ) ) {
                            res.json( doc );
                        } else {
                            res.statusCode = 403;
                            res.json( {
                                error: '_unauthorised_user'
                            } );
                        }
                    }
                    db.close();
                }
            } );
        }
    } );
} );

router.get('/deleteDoc', function ( req, res, next ) {
    var query = req.query;
    var oid =  ObjectId( query._id );
    var udetails = user.getDetails( req );
    if( ! ( udetails && udetails.mail ) ) {
        req.json( {
            error: '_invalid_user'
        } );
        return;
    }

    mongo.authorizedUser( {
        res: res,
        req: req,
        query: {
            _id: oid
        },
        collectionName: collectionName,
        callback: function ( obj ) {


            mongo.remove( { 
                collection: obj.collection,
                query: {
                    _id: oid
                },
                res: res,
                callback: function () {
                    res.json('');
                    obj.db.close();
                }
            } );
        }
    } );
} );

router.post('/updateDoc', function(req, res, next) {
    
    var data = req.body.data;
    var id = req.body._id;
    var oid = new ObjectId( id );
    var udetails = user.getDetails( req );
    if( !( udetails && udetails.mail ) ) {
        req.json( {
            error: '_invalid_user'
        } );
        return;
    }
    var setObj = siteUtils.getSetObject( data, collectionName );
    if ( !setObj ) {
        res.json('');
        return;
    }

    mongo.authorizedUser( {
        res: res,
        req: req,
        query: {
            _id: oid
        },
        collectionName: collectionName,
        callback: function ( obj ) {
            console.log( 'even here' );
            setObj.lastUpdated = +new Date();
            setObj.lastUpdatedBy = {
                uid: udetails.uid,
                mail: udetails.mail
            };
            mongo.update( {
                res: res,
                collection: obj.collection,
                query: {
                    _id: oid    
                },
                setData: {
                    $set: setObj
                },
                callback: function  ( err, doc ) {
                    res.json('');
                    obj.db.close();    
                }
            } );
        }
    } );
});

router.post('/expressInterest', function(req, res, next) {    
    var data = req.body.data;
    var id = req.body._id;
    var oid = new ObjectId( id );
    var udetails = user.getDetails( req );
    if( !( udetails && udetails.mail ) ) {
        req.json( {
            error: '_invalid_user'
        } );
        return;
    }

    mongo.connect({
        res: res,
        callback: function(err, db) {
            var collection = db.collection( collectionName );
            mongo.findOne( {
                res: res,
                query: {
                    _id: oid
                },
                collection: collection,
                callback: function  ( err, doc ) {
                    console.log( 'even here', doc );
                    if( !doc ) {
                        console.log( 'error 404' );
                        res.statusCode = 404;
                        res.json( {
                            error: '_item_not_found'
                        } );
                        db.close();
                        return;
                    } 
                    else {
                        console.log( 'eles' );
                        doc.interests = doc.interests || [];
                        console.log( 'doc.owner.mail: ' ,doc.owner.mail);
                        console.log( 'udetails.mail: ' ,udetails.mail);
                        if( udetails.mail ===  doc.owner.mail ) {
                            console.log( 'error:403' );

                            res.statusCode = 403;
                            res.json( {
                                error: '_item_owner'
                            } );
                            db.close();
                        } else {
                            var currentItem = {
                                hours: data.hours,
                                aboutme: data.aboutme,
                                mail: udetails.mail,
                                firstName: udetails.firstName,
                                lastName: userdetails.lastName,
                                uid: udetails.uid
                            };

                            var isExists = false;
                            for (var i = doc.interests.length - 1; i >= 0; i--) {
                                
                                if( doc.interests[ i ].mail === udetails.mail ) {
                                    isExists = true;    
                                    doc.interests[ i ].hours = data.hours;
                                    doc.interests[ i ].aboutme = data.aboutme;
                                    break;
                                }
                            }
                            if( !isExists ) {
                                doc.interests.push( currentItem );
                            }

                            mongo.update( {
                                res: res,
                                collection: collection,
                                query: {
                                    _id: oid    
                                },
                                setData: {
                                    $set: {
                                        interests: doc.interests
                                    }
                                },  
                                callback: function  ( err, udoc ) {
                                    res.json('');
                                    var mail = require('./modules/mail.js');
                                    mail.send( doc, currentItem );
                                    db.close();    
                                }
                            } );
                        }
                    }
                }
            } );
        }
    });
});

router.post('/toggleVote', function(req, res, next) {

    var id = req.body._id;
    var oid = new ObjectId( id );
    var udetails = user.getDetails( req );
    if( !( udetails && udetails.mail ) ) {
        req.json( {
            error: '_invalid_user'
        } );
        return;
    }
    mongo.connect( {
        res: res,
        callback: function(err, db) {
            var collection = db.collection( collectionName );
            mongo.findOne( {
                res: res,
                query: {
                    _id: oid
                },
                collection: collection,
                callback: function  ( err, doc ) {
                    console.log( 'even here', doc );
                    if( !doc ) {
                        console.log( 'error 404' );
                        res.statusCode = 404;
                        res.json( {
                            error: '_item_not_found'
                        } );
                        db.close();
                        return;
                    } 
                    else {
                        
                        doc.likes = doc.likes || [];
                        var index = doc.likes.indexOf( udetails.mail );
                        if( index !== -1 ) {
                            
                            doc.likes.splice( index, 1 );
                        
                        } else {

                            doc.likes.push( udetails.mail );

                        }

                        mongo.update( {
                            res: res,
                            collection: collection,
                            query: {
                                _id: oid    
                            },
                            setData: {
                                $set: {
                                    likes: doc.likes
                                }
                            },  
                            callback: function  ( err, udoc ) {
                                res.json('');
                                db.close();
                            }
                        } );
                    }
                }
            } );
        }
    });
});


router.get('/userdetails', function(req, res, next) {
    res.json( user.getAllDetails( req ) );
});

router.get('/logout', function(req, res, next) {
    if (req.session.destroy) {
        req.session.destroy();
    } else {
        req.session = null;
    }
    res.send('');
});

module.exports = router;
