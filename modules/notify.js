var app = require( './../server/server' );
var appSocket = require( './../server/app-socket' );

var notify = function( obj ) {

    var Notification = app.models.Notification;
    obj.toBeRead = true;
    obj.createdAt = +new Date();
    Notification.create( obj );

    var i, j, mail, sockets;
    for( i = obj.to.length - 1; i >=0 ; i-- ) {
        mail = obj.to[ i ].mail;
        sockets = appSocket.activeConnection[ mail ]; 
        if( sockets ) {
            for( j = sockets.length-1 ; j>=0 ; j-- ) {
                app.io.to( sockets[ j ] ).emit( 'new-feed', obj );
            }
        }
        
    }
    

};


module.exports = notify;