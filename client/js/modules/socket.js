define([
    'socketio'
], 
function(
    socketio
){
    var socket;

    return {
       getSocket: function() {
            if( !socket ) {
                socket = socketio()
            }
            return socket;
       }
    };
});
