var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var dbname = 'corridorApp';
var url = 'mongodb://localhost:27017/';
var mongo = {};
mongo.connect = function(obj) {
    var connectUrl = url + (obj.dbname || +dbname);
    MongoClient.connect(connectUrl, obj.callback);
};
mongo.getCollection = function(obj) {
    obj.db.collection(obj.collectionName, obj.callback);
};
mongo.find = function(obj) {
    var query = obj.query || {};
    return obj.db.collection(obj.collectionName).find(query);
};
mongo.findOne = function(obj) {
    var query = obj.query || {};
    return obj.db.collection(obj.collectionName).findOne(query);
};
module.exports = mongo;
