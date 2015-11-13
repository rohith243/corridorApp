var user = require( '../../modules/user' );
var disableAllMethodsBut = require( '../../modules/disable-all-methods-but');

module.exports = function(Feature) {
    disableAllMethodsBut( Feature, [] );


    Feature.allFeatureConfigs = function( req, res, cb ) {
        Feature.find({}, function(err, res ) {      
          cb( null, res );
        } );
    };

    Feature.remoteMethod('allFeatureConfigs', {
        returns: {arg: 'features', root: true},
        http: { verb: 'GET' },
        accepts:[
            { arg: 'req', type: 'object', 'http': {source: 'req'}},
            { arg: 'res', type: 'object', 'http': {source: 'res'}}
        ]
    });
    Feature.updateFeatureConfig = function( data, req, res, cb ) {
        udetails = user.getDetails( req );
        if( !udetails || udetails&&!udetails.admin) {
            res.statusCode = 404;
            res.json( {
                error: udetails ? '_unauthorized_user' :  '_not_loggedin'
            } );
            return;
        }
        var id = data.id;;
        Feature.findById( id, function( err, doc ) {
            doc.updateAttributes( data, function( err, res ) {
                cb( null, res );
            } );
        } );
        
    };

    Feature.remoteMethod('updateFeatureConfig', {
        returns: {arg: 'features', root: true},
        accepts:[
          { arg: 'data', type: 'object', 'http': {source: 'body'} },
          { arg: 'req', type: 'object', 'http': {source: 'req'}},
          { arg: 'res', type: 'object', 'http': {source: 'res'}}
        ]
    });



    Feature.addFeatureConfig = function( data, req, res, cb ) {
        udetails = user.getDetails( req );
        if( !udetails || udetails&&!udetails.admin) {
            res.statusCode = 404;
            res.json( {
                error: udetails ? '_unauthorized_user' :  '_not_loggedin'
            } );
            return;
        }
        var setObj = data;
        setObj.owner = udetails;
        setObj.createdAt = +new Date();
        Feature.create( setObj , function(err, res ) {      
          cb( null, res );
        } );
    };

    Feature.remoteMethod('addFeatureConfig', {
        returns: {arg: 'feature', root: true},
        accepts:[
          { arg: 'data', type: 'object', 'http': {source: 'body'} },
          { arg: 'req', type: 'object', 'http': {source: 'req'}},
          { arg: 'res', type: 'object', 'http': {source: 'res'}}
        ]
    });


    Feature.deleteFeatureConfig = function( id, req, res, cb ) {
        if( !udetails || udetails&&!udetails.admin) {
            res.statusCode = 404;
            res.json( {
                error: udetails ? '_unauthorized_user' :  '_not_loggedin'
            } );
            return;
        }
        Feature.destroyById( id, function( err, res ) {
            cb( null, res );
        } );
    };

    Feature.remoteMethod('deleteFeatureConfig', {
        returns: {arg: 'feature', root: true},
        accepts:[
          { arg: 'id', type: 'string', required: true },
          { arg: 'req', type: 'object', 'http': {source: 'req'}},
          { arg: 'res', type: 'object', 'http': {source: 'res'}}
        ],
        http: { verb: 'GET' }
    });

};
