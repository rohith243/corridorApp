var app = require( './../server/server' );
var appSocket = require( './../server/app-socket' );

var notify = function( obj ) {

    var Notification = app.models.Notification;
    obj.createdAt = +new Date();
    var i, j, mail, sockets;
    if( obj.to ) {
        for( i = obj.to.length - 1; i >=0 ; i-- ) {
            mail = obj.to[ i ].mail;
            obj.to[ i ].toBeRead = true;
            sockets = appSocket.activeConnection[ mail ]; 
            if( sockets ) {
                for( j = sockets.length-1 ; j>=0 ; j-- ) {
                    app.io.to( sockets[ j ] ).emit( 'new-feed', obj );
                }
            }
        }    
    } 
    
    Notification.create( obj );
    

};


module.exports = notify;