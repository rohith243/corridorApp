var express = require('express');
var router = express.Router();
var mongo = require('./mongo-db/index.js');
var JSONStream = require('JSONStream');
var ObjectId = require('mongodb').ObjectID;
var user = require('./modules/user');
var siteUtils = require('./modules/site-utils');
var collectionName = 'letsbuild';
var mail = require('./modules/mail.js');

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
        res.json( {
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
        res.json( {
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
    if( ! ( udetails && udetails.mail )  ) {
        res.statusCode = 403;
        res.json( {
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
                res: res,
                query: {
                    _id: oid
                },
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
        res.json( {
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
                    var oldIntColl = obj.oldDoc.interests,
                    newIntcoll = setObj.interests,
                    oldIntIndex,newIntIndex;
                    if (newIntcoll && oldIntColl) {
                        for(oldIntIndex in oldIntColl) {
                            for(newIntIndex in newIntcoll) {
                                if (oldIntColl[oldIntIndex].mail == newIntcoll[newIntIndex].mail) {
                                    if (oldIntColl[oldIntIndex].isContributor != newIntcoll[newIntIndex].isContributor) {
                                        //send mail
                                        if (newIntcoll[newIntIndex].isContributor) {
                                            // added to contributors list
                                            mail.notifyContributor(obj.oldDoc,newIntcoll[newIntIndex],"You are added to contributors of "); 
                                        }
                                        else {
                                            // removed from contributors list
                                            mail.notifyContributor(obj.oldDoc,newIntcoll[newIntIndex],"You are removed from contributors of ");
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    }
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
        res.json( {
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
                        doc.interests = doc.interests || [];
                        if( udetails.mail ===  doc.owner.mail ) {
                            console.log( 'error:403' );

                            res.statusCode = 403;
                            res.json( {
                                error: '_item_owner'
                            } );
                            db.close();
                            return;
                        }
                        else {
                            var currentItem = {
                                hours: data.hours,
                                aboutme: data.aboutme,
                                mail: udetails.mail,
                                firstName: udetails.firstName,
                                lastName: udetails.lastName,
                                uid: udetails.uid
                            };
                            var isExists = false;
                            for (var i = doc.interests.length - 1; i >= 0; i--) {
                                if( doc.interests[ i ].mail === udetails.mail ) {
                                    isExists = true;    
                                    doc.interests[ i ] = currentItem;
                                    break;
                                }
                            }
                            if( !isExists ) {
                                currentItem.isContributor = false;
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

router.get('/unExpressInterest', function(req, res, next) {    
    var id = req.query._id;
    var oid = new ObjectId( id );
    var udetails = user.getDetails( req );
    if( !( udetails && udetails.mail ) ) {
        res.json( {
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
                        doc.interests = doc.interests || [];
                        var isExists = false;
                        for (var i = doc.interests.length - 1; i >= 0; i--) {
                            if( doc.interests[ i ].mail === udetails.mail ) {
                                isExists = true;    
                                doc.interests.splice( i, 1 );
                                break;
                            }
                        }
                        if( !isExists ) {
                           res.json( {
                            interests : doc.interests
                           } )
                           return;
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
                                res.json({
                                  interests : doc.interests
                                });
                                db.close();    
                            }
                        } );
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
        res.json( {
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

router.post('/adminUpdate', function(req, res, next) {
    var data = req.body.data;
    var id = req.body._id;
    var oid = new ObjectId( id );
    var udetails = user.getDetails( req );

    if( !( udetails.admin ) ) {
        res.statusCode = '403';
        res.json( {
            error: '_invalid_user'
        } );
        return;
    }

    var setObj = data;
    mongo.connect({
        res: res,
        callback: function(err, db) {
            
            var collection = db.collection( collectionName );
            
            mongo.update( {
                res: res,
                collection: collection,
                query: {
                    _id: oid    
                },
                setData: {
                    $set: setObj
                },
                callback: function  ( err, doc ) {

                    res.json('');
                    db.close();
                }
            } );
        }
    });
});

router.get('/deleteAdmin', function(req, res, next) {
    var id = req.query._id;
    var oid = new ObjectId( id );
    var udetails = user.getDetails( req );

    if( !( udetails.admin ) ) {
        res.statusCode = '403';
        res.json( {
            error: '_invalid_user'
        } );
        return;
    }
    mongo.connect({
        res: res,
        callback: function(err, db) {
            
            var collection = db.collection( collectionName );
            
            mongo.remove( { 
                collection: collection,
                res: res,
                query: {
                    _id: oid
                },
                callback: function () {
                    res.json('');
                    db.close();
                }
            } );
        }
    });
});

router.get('/userdetails', function(req, res, next) {
    res.json( user.getAllDetails( req ) );
});


router.post('/updateSiteConfig', function(req, res, next) {
    var udetails =  user.getDetails( req );
    if( !udetails.admin ) {
        res.statusCode = '403';
        res.json( {
            error: '_invalid_user'
        } );
        return;
    }
    
    user.setConfig( {
        res: res,
        data: req.body.data,
        callback : function() {
            res.end( '' ); 
        }
    } );
});


router.post('/addFeatureConfig', function(req, res, next) {
    var udetails =  user.getDetails( req );
    if( !udetails.admin ) {
        res.statusCode = '403';
        res.json( {
            error: '_invalid_user'
        } );
        return;
    }

    mongo.connect( {
        res: res,
        callback: function(err, db) {
            var data = req.body.data;
            var setObj = siteUtils.getSetObject( data, 'featureConfig' );

            setObj.createdAt = +new Date();
            setObj.owner =  {
                uid: udetails.uid,
                firstName: udetails.firstName,
                lastName: udetails.lastName,
                mail: udetails.mail
            };
            
            var collection = db.collection( 'featureConfig' );
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
});

router.get('/allFeatureConfigs', function(req, res, next) {
    var udetails =  user.getDetails( req );
    /*if( !udetails.admin ) {
        res.statusCode = '403';
        res.json( {
            error: '_invalid_user'
        } );
        return;
    }*/
    mongo.connect( {
        res: res,
        callback: function(err, db) {
            var proj = {}; 
            try {
                proj = JSON.parse( req.query.projection );
            } catch( e ) {

            }

            var obj = {
                db: db,
                collectionName: 'featureConfig',
                projection: proj
            };

            var cursor = mongo.find(obj);
            cursor.stream().pipe(JSONStream.stringify()).pipe(res);
        }
    });
});

router.post('/updateFeatureConfig', function(req, res, next) {
    var data = req.body.data;
    var id = req.body._id;
    var oid = new ObjectId( id );
    var udetails = user.getDetails( req );
    if( !( udetails && udetails.admin ) ) {
        res.json( {
            error: '_invalid_user'
        } );
        return;
    }
    
    var setObj = siteUtils.getSetObject( data, 'featureConfig' );
    if ( !setObj ) {
        res.json('');
        return;
    }

    mongo.connect( {
        res: res,
        callback: function(err, db) {            
            var collection = db.collection( 'featureConfig' );
            collection.ensureIndex("featureKey");
            setObj.lastUpdated = +new Date();
            setObj.lastUpdatedBy = {
                uid: udetails.uid,
                mail: udetails.mail
            };

            mongo.update( {
                res: res,
                collection: collection,
                query: {
                    _id: oid    
                },
                setData: {
                    $set: setObj
                },
                callback: function  ( err, doc ) {
                    res.json('');
                    db.close();    
                }
            } );
        }
    });
});


router.get('/deleteFeatureConfig', function ( req, res, next ) {
    var query = req.query;
    var oid =  ObjectId( query._id );
    var udetails = user.getDetails( req );
    if( ! ( udetails && udetails.admin )  ) {
        res.statusCode = 403;
        res.json( {
            error: '_invalid_user'
        } );
        return;
    }

     mongo.connect( {
        res: res,
        callback: function(err, db) {            
            var collection = db.collection( 'featureConfig' );
            mongo.remove( { 
                collection: collection,
                res: res,
                query: {
                    _id: oid
                },
                callback: function () {
                    res.json('');
                    db.close();
                }
            } );
        }
    });
} );


router.get('/verifyFeature', function ( req, res, next ) {
    
    var query = req.query;
    var oid =  ObjectId( query._id );
    var udetails = user.getDetails( req );
    
    mongo.connect( {
        res: res,
        callback: function( err, db ) {
            var collection = db.collection( 'featureConfig' );
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
                    res.json( {
                        status: user.checkFeatureConfig( doc, udetails )    
                    } )
                    db.close();
                }
            } );
        }
    } );    
} );



router.get('/logout', function(req, res, next) {
    if (req.session.destroy) {
        req.session.destroy();
    } else {
        req.session = null;
    }
    res.send('');
});

module.exports = router;
