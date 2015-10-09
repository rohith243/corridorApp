var express = require('express');
var router = express.Router();
var mongo = require('./mongo-db/index.js');
var JSONStream = require('JSONStream');
var ObjectId = require('mongodb').ObjectID;
var user = require('./modules/user');
var siteUtils = require('./modules/site-utils');

router.get('/collection', function(req, res, next) {
    var query = req.query;
    mongo.connect({
        callback: function(err, db) {
            if (err) {
                console.log({
                    'error': '_error_mongo'
                });
                return;
            }
            var obj = {
                db: db,
                collectionName: query.cname
            };
            if (query.cond) {
                try {
                    obj.query = JSON.parse(query.cond);
                } catch (e) {
                    console.log('error in parsing reqest');
                }
            }
            obj.query = obj.query || {
            };
            
            var udetails = user.getDetails( req );
            if ( (query.isuid === 'true' || query.isuid === true ) && udetails ) {
                obj.query['owner.mail'] = udetails.mail;
            }
            console.log( obj );

            var cursor = mongo.find(obj);
            cursor.stream().pipe(JSONStream.stringify()).pipe(res);
        }
    });
});
router.get('/deletedoc', function(req, res, next) {
    var query = req.query;
    mongo.connect({
        callback: function(err, db) {
            if (err) {
                console.log({
                    'error': '_error_mongo'
                });
                return;
            }
            var collection = db.collection(query.cname);
            collection.remove({
                _id: new ObjectId(query._id)
            }, function(err, count) {
                if (err) {
                    console.log({
                        'error': '_error_mongo'
                    });
                    return;
                }
                res.json('');
                db.close();
            });
        }
    });
});
router.get('/getdocument', function(req, res, next) {
    var query = req.query;
    mongo.connect({
        callback: function(err, db) {
            if (err) {
                console.log({
                    'error': '_error_mongo'
                });
                return;
            }
            var collection = db.collection(query.cname);
            collection.findOne({
                _id: new ObjectId(query._id)
            }, function(err, doc) {
                if (err) {
                    console.log({
                        'error': '_error_mongo'
                    });
                    return;
                }
                res.json(doc);
                db.close();
            });
        }
    });
});
router.post('/update', function(req, res, next) {
    var data = req.body.data;
    var cname = req.body.cname;
    var id = req.body._id;
    var setObj = siteUtils.getSetObject( data, cname );
    if (!setObj) {
        res.json('');
        return;
    }
    mongo.connect({
        callback: function(err, db) {
            if (err) {
                console.log({
                    'error': '_error_mongo'
                });
                return;
            }
            var collection = db.collection(cname);
            setObj.lastUpdated = +new Date();
            var udetails = user.getDetails( req );
            console.log( 'udetails', udetails ); 
            setObj.lastUpdatedBy = {
                uid: udetails.uid,
                mail: udetails.mail
            };
            collection.update({
                _id: new ObjectId(id)
            }, {
                $set: setObj
            }, function(err, doc) {
                if (err) {
                    console.log({
                        'error': '_error_mongo'
                    });
                    return;
                }
                console.log(doc);
                res.json('');
                db.close();
            });
        }
    });
});
router.post('/adddocument', function(req, res, next) {
    var data = req.body.data;
    var cname = req.body.cname;
    var setObj = siteUtils.getSetObject(data, cname);
    mongo.connect({
        callback: function(err, db) {
            if (err) {
                console.log({
                    'error': '_error_mongo'
                });
                return;
            }
            var collection = db.collection(cname);
            setObj.createdAt = +new Date();
            var udetails = user.getDetails( req );
            setObj.owner =  {
                uid: udetails.uid,
                mail: udetails.mail
            };
        
            collection.insert(setObj, function(err, doc) {
                if (err) {
                    console.log({
                        'error': '_error_mongo'
                    });
                    return;
                }
                res.json(setObj);
                db.close();
            });
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
router.post('/push', function(req, res, next) {
    var cname = req.body.cname;
    var id = req.body._id;
    var data = req.body.data;
    var key = req.body.key;
    mongo.connect({
        callback: function(err, db) {
            if (err) {
                console.log({
                    'error': '_error_mongo'
                });
                return;
            }
            var collection = db.collection(cname);
            collection.update({
                _id: new ObjectId(id)
            }, {
                $push: data
            }, function(err, doc) {
                if (err) {
                    console.log({
                        'error': '_error_mongo'
                    });
                    return;
                }
                if( key === 'expressinterest' ) {
                    collection.findOne({_id:new ObjectId(id)}, function(err, item) {
                        
                        if( err ) {
                            console.log({
                                'error': '_error_mongo'
                            });
                            return;
                        }
                        var mail = require('./modules/mail.js');
                        mail.send( item, data.interests );

                        db.close();    
                    });
                }
                
                
                res.json('');
                
            });
        }
    });
});
module.exports = router;
