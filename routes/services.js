var express = require('express');
var router = express.Router();
var mongo = require('./mongo-db/index.js');
var JSONStream = require('JSONStream');
var ObjectId = require('mongodb').ObjectID;
var getSetObject = function(data, cname) {
    var obj = {};
    var objupdated = false;
    var map = {
        appstore: ['name', 'category', 'src', 'srcLg', 'infotext', 'href', 'desc'],
        letsbuild: [
            'name', 
            'src', 
            'status', 
            'effort', 
            'percentageOfCompletion', 
            'category', 
            'href',
            'division',
            'shortDesc',
            'longDesc',
            'techDetails',
            'vedioLink',
            'minimumBid',
            'team',
            'proposedTeam',


            'appName',
            'shortDesc',
            'longDesc',
            'proposedTeam',
            'links',
            'solution',
            'contributors',
            'isPublish',
            'public',
            'invites',
            'imgurl',
            'interests'
        ],
        globals: ['name', 'type', 'value']
    };


    for (var len = map[cname].length - 1; len >= 0; len--) {
        var key = map[cname][len];
        if ( typeof data[key] !== 'undefined' ) {
            objupdated = true;
            obj[key] = data[key];
        }
    }
    if (objupdated) {
        return obj;
    } else {
        return false;
    }
};

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

            if( query.cond ) {
                try{
                    obj.query = JSON.parse( query.cond );     
                } catch( e ) {
                    console.log( 'error in parsing reqest' );
                }
            }
            
            obj.query = obj.query || {};
            if( ( query.isuid === 'true' || query.isuid === true ) && req.session.cas && req.session.cas.attributes ) {
                obj.query.owner = req.session.cas.attributes.uid[ 0 ];
            }

            var cursor = mongo.find( obj );
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



    var setObj = getSetObject(data, cname);

    console.log( 'setObj', setObj );

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
            setObj.lastUpdatedBy = req.session.cas.attributes.uid[ 0 ];
            

            

            console.log( setObj );
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
                console.log( doc );
                res.json('');
                db.close();
            });
        }
    });
});
router.post('/adddocument', function(req, res, next) {
    var data = req.body.data;
    var cname = req.body.cname;
    var setObj = getSetObject(data, cname);
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
            setObj.owner = req.session.cas.attributes.uid[ 0 ];
            collection.insert(setObj, function(err, doc) {
                if (err) {
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



router.get('/userdetails', function(req, res, next) {
    res.json( req.session.cas && req.session.cas.attributes || '' );
});

router.get('/logout', function(req, res, next) {
    
    if ( req.session.destroy ) {
        req.session.destroy();
    } else {
        req.session = null;
    }
    
    res.send('');
});

router.post('/expressInterest', function(req, res, next) {
    var cname = req.body.cname;
    var id = req.body._id;
    var user = req.body.user;
    mongo.connect({
        callback: function(err, db) {
            if (err) {
                console.log({
                    'error': '_error_mongo'
                });
                return;
            }
            console.log("before");
            var collection = db.collection(cname);
            console.log("after");

            collection.update({
                _id: new ObjectId(id)
            }, {
                $push: { interests: user } 
            }, function(err, doc) {
                if (err) {
                    console.log({
                        'error': '_error_mongo'
                    });
                    return;
                }
                console.log( doc );
                res.json('');
                db.close();
            });
        }
    });
});


module.exports = router;


