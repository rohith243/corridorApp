define([
    'socketio'
], 
function(
    socketio
){
    var socket;

    return {
       getSocket: function() {
            var url = document.URL;
            if( !socket ) {
                socket = socketio( url )
            }
            return socket;
       }
    };
});
