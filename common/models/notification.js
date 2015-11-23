var user = require( '../../modules/user' );
var disableAllMethodsBut = require( '../../modules/disable-all-methods-but');

module.exports = function(Notification) {
    
    disableAllMethodsBut( Notification, [] );
    /*Notification.notifications = function( req, res, cb ) {
        Notification.find({
          where: { isPublish: true }
        }, function(err, res ) {      
          cb( null, res );
        } );
    };
    Notification.remoteMethod('notifications', {
        returns: {arg: 'notifications', root: true},
        http: { verb: 'GET' },
        accepts:[
            { arg: 'req', type: 'object', 'http': {source: 'req'}},
            { arg: 'res', type: 'object', 'http': {source: 'res'}}
        ]
    });*/

};
