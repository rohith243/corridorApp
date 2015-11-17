var user = require( '../../modules/user' );
var disableAllMethodsBut = require( '../../modules/disable-all-methods-but');
var mail = require( '../../modules/mail' );

module.exports = function(App) {
    
    disableAllMethodsBut( App, [] );
    App.publishedApps = function( req, res, cb ) {
        App.find({
          // find locations near the provided GeoPoint
          where: { isPublish: true }
        }, function(err, res ) {      
          cb( null, res );
        } );
    };

    App.remoteMethod('publishedApps', {
        returns: {arg: 'apps', root: true},
        http: { verb: 'GET' },
        accepts:[
            { arg: 'req', type: 'object', 'http': {source: 'req'}},
            { arg: 'res', type: 'object', 'http': {source: 'res'}}
        ]
    });


    App.myApps = function(req, res, cb) {
        
        udetails = user.getDetails( req );
        if( !udetails ) {
            res.statusCode = 404;
            res.json( {
                error: '_not_loggedin'
            } );
            return;
        }
        App.find({
          where: {'owner.mail': udetails.mail }
        }, function(err, res ) {      
          cb( null, res );
        } );

    };

    App.remoteMethod('myApps', {
        returns: {arg: 'apps', root: true},
        http: { verb: 'GET' },
        accepts:[
            { arg: 'req', type: 'object', 'http': {source: 'req'}},
            { arg: 'res', type: 'object', 'http': {source: 'res'}}
        ]
    });


    App.createApp = function( data, req, res, cb ) {
        udetails = user.getDetails( req );
        if( !udetails ) {
            res.statusCode = 403;
            res.json( {
                error: '_not_loggedin'
            } );
            return;
        }
        var setObj = data;
        setObj.owner = udetails;
        setObj.createdAt = +new Date();
        App.create( setObj , function(err, res ) {      
          cb( null, res );
        } );
    };

    App.remoteMethod('createApp', {
        returns: {arg: 'app', root: true},
        accepts:[
          { arg: 'data', type: 'object', 'http': {source: 'body'} },
          { arg: 'req', type: 'object', 'http': {source: 'req'}},
          { arg: 'res', type: 'object', 'http': {source: 'res'}}
        ]
    });



    App.updateApp = function( data, req, res, cb ) {
        udetails = user.getDetails( req );
        if( !udetails ) {
            res.statusCode = 404;
            res.json( {
                error: '_not_loggedin'
            } );
            return;
        }
        var id = data.id;;
        App.findById( id, function( err, doc ) {
            var setObj = data;
            setObj.lastUpdatedBy = udetails;
            setObj.lastUpdatedAt = +new Date();
            if(  udetails.mail === doc.owner.mail || udetails.admin ) {
                doc.updateAttributes( data, function( err, res ) {
                    cb( null, res );
                } );
                
            } else {
                res.statusCode = 404;
                res.json( {
                    error: '_unauthorized_user'
                } );
                return;
            }
            
            
        } );
        
    };

    App.remoteMethod('updateApp', {
        returns: {arg: 'app', root: true},
        accepts:[
          { arg: 'data', type: 'object', 'http': {source: 'body'} },
          { arg: 'req', type: 'object', 'http': {source: 'req'}},
          { arg: 'res', type: 'object', 'http': {source: 'res'}}
        ]
    });


    App.deleteApp = function( id, req, res, cb ) {
        udetails = user.getDetails( req );
        if( !udetails ) {
            res.statusCode = 404;
            res.json( {
                error: '_not_loggedin'
            } );
            return;
        }

        App.findById( id, function( err, doc ) {
            if(  udetails.mail !== doc.owner.mail ) {
                res.statusCode = 404;
                res.json( {
                    error: '_unauthorized_user'
                } );
                return;
            }
            App.destroyById( id, function( err, res ) {
                cb( null, res );
            } );
        } );
        
    };

    App.remoteMethod('deleteApp', {
        returns: {arg: 'app', root: true},
        accepts:[
          { arg: 'id', type: 'string', required: true },
          { arg: 'req', type: 'object', 'http': {source: 'req'}},
          { arg: 'res', type: 'object', 'http': {source: 'res'}}
        ],
        http: { verb: 'GET' }
    });


    App.getApp = function(id, req, res, cb ) {
        
        var udetails = user.getDetails( req );
        App.findById( id, function(err, doc ) {
          if( !doc ) {
            res.statusCode = 404;
            res.json( {
                error: '_item_not_found'
            } );
            return;
          } 
          if( doc.isPublish ||  udetails && udetails.mail === doc.owner.mail ) {
            cb( null, doc)
          } else {
            res.statusCode = 403;
            res.json( {
                error: '_invalid_user'
            } );
            return;
          }
        } );
    };

    App.remoteMethod('getApp', {
        returns: {arg: 'apps', root: true},
        http: { verb: 'GET' },
        accepts:[
          { arg: 'id', type: 'string', required: true },
          { arg: 'req', type: 'object', 'http': {source: 'req'}},
          { arg: 'res', type: 'object', 'http': {source: 'res'}}
        ],
        http: { verb: 'GET' }
    });


    App.toggleVote = function( id, req, res, cb ) {
        udetails = user.getDetails( req );
        if( !udetails ) {
            res.statusCode = 404;
            res.json( {
                error: '_not_loggedin'
            } );
            return;
        }
        App.findById( id, function( err, doc ) {
            doc.likes = doc.likes || [];
            var index = doc.likes.indexOf( udetails.mail );
            if( index !== -1 ) {
                doc.likes.splice( index, 1 );
            } else {
                doc.likes.push( udetails.mail );
            }
            doc.updateAttributes( {likes:doc.likes}, function( err, res ) {
                cb( null, res );
            } );
            
        } );
        
    };

    App.remoteMethod('toggleVote', {
        returns: {arg: 'app', root: true},
        http: { verb: 'GET' },
        accepts:[
          { arg: 'id', type: 'string', required: true },
          { arg: 'req', type: 'object', 'http': {source: 'req'}},
          { arg: 'res', type: 'object', 'http': {source: 'res'}}
        ]
    });



    App.expressInterest = function( data, req, res, cb ) {
        udetails = user.getDetails( req );
        if( !udetails ) {
            res.statusCode = 404;
            res.json( {
                error: '_not_loggedin'
            } );
            return;
        }
        var id = data.id;
        App.findById( id, function( err, doc ) {
            doc.interests = doc.interests || [];
            if( udetails.mail ===  doc.owner.mail ) {
                res.statusCode = 403;
                res.json( {
                    error: '_item_owner'
                } );
                return;
            } else {
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
                    doc.interests.push( currentItem );
                }
                doc.updateAttributes( {
                    interests:doc.interests
                }, function( err, res ) {
                    cb( null, res );
                    mail.send( doc, currentItem );
                } );
            }
        } );
        
    };

    App.remoteMethod('expressInterest', {
        returns: {arg: 'app', root: true},
        accepts:[
          { arg: 'data', type: 'object', 'http': {source: 'body'} },
          { arg: 'req', type: 'object', 'http': {source: 'req'}},
          { arg: 'res', type: 'object', 'http': {source: 'res'}}
        ]
    });


    App.unExpressInterest = function( id, req, res, cb  ) {
        udetails = user.getDetails( req );
        if( !udetails ) {
            res.statusCode = 404;
            res.json( {
                error: '_not_loggedin'
            } );
            return;
        }
        App.findById( id, function( err, doc ) {

            if( doc ) {
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
                doc.updateAttributes( {interests:doc.interests}, function( err, res ) {
                    cb( null, res );
                } )
            } else {
                res.statusCode = 404;
                res.json( {
                    error: '_item_not_found'
                } ) 
            }
            /*doc.likes = doc.likes || [];
            var index = doc.likes.indexOf( udetails.mail );
            if( index !== -1 ) {
                doc.likes.splice( index, 1 );
            } else {
                doc.likes.push( udetails.mail );
            }
            doc.updateAttributes( {likes:doc.likes}, function( err, res ) {
                cb( null, res );
            } );*/


            
        } );
    };

    App.remoteMethod('unExpressInterest', {
        returns: {arg: 'app', root: true},
        http: { verb: 'GET' },
        accepts:[
          { arg: 'id', type: 'string', required: true },
          { arg: 'req', type: 'object', 'http': {source: 'req'}},
          { arg: 'res', type: 'object', 'http': {source: 'res'}}
        ]
    });

};
