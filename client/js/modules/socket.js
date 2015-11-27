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
                socket = socketio( document.URL )
            }
            return socket;
       }
    };
});
