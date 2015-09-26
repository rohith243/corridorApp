var fs = require('fs');
var request = require('request');
var handleContent = {};
var mongo = require('./../mongo-db/index.js');
var dbcontent = require('./dbcontent.js');
handleContent.cachecontent = function(req, res, next, obj) {
    var url = req.protocol + '://' + req.get('host') + req.originalUrl;
    if (fs.existsSync('./views/cached-pages/' + obj.template + '.ejs')) {
        res.render('cached-pages/' + obj.template, obj.data);
    } else {
        request(url + '/clearcache', function(error, response, body) {
            var dir = './views/cached-pages';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            fs.writeFile('./views/cached-pages/' + obj.template + '.ejs', body, function(err) {
                if (err) {
                    console.log('error in caching the page');
                } else {
                    console.log('successfully cached');
                }
            });
            res.end(body);
        });
    }
};
handleContent.originalContent = function(req, res, next, obj) {
    if (fs.existsSync('./views/cached-pages/' + obj.template + '.ejs')) {
        fs.unlinkSync('./views/cached-pages/' + obj.template + '.ejs');
    }
    mongo.connect({
        callback: function(err, db) {
            if (err) {
                console.log({
                    'error': '_error_mongo'
                });
                return;
            }
            var collection = db.collection('globals');
            collection.find().toArray(function(err, docs) {
                if (err) {
                    console.log('error occured..');
                }
                res.render(obj.template, {
                    data: docs,
                    dbcontent: dbcontent
                });
                db.close();
            });
        }
    });
};
module.exports = handleContent;
