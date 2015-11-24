var socket = require( 'socket.io' );
var appSocket = {};

appSocket.activeConnection = {};

appSocket.init = function( app, server ) {
  app.io =  socket( server );

  /*to get http session into socket*/
  app.io.use(function( socket, next) {
      var res = {};
      app.sessionMiddleware( socket.handshake, res, function(){
          socket.session = socket.handshake.session;
          socket.session.id = socket.handshake.sessionID;
          next();
      } );
  });

  var Notification = app.models.Notification;
  app.io.on('connection', function( socket ){

    var user = require( '../modules/user' );
    var details = user.getDetails( socket );
    var current, index;
    
    if( details ) {
      
      appSocket.activeConnection[ details.mail ] = appSocket.activeConnection[ details.mail ] || [];
      current = appSocket.activeConnection[ details.mail ];
      index = current.indexOf( socket.id );
      
      if( index === -1 ) {
        appSocket.activeConnection[ details.mail ].push( socket.id  );
      }

      socket.on( 'req-feeds', function( req ) {
        req = req || {};
        req.size = req.size || 10;
        req.page = req.page || 1;

        Notification.find({
          where:{
            to: {
              elemMatch: {
                mail: details.mail
              }
            }
          },
          limit: req.size, 
          skip: ( req.page - 1 ) * req.size,
          order: [ 'createdAt DESC' ],
        }, function(err, res ) {      
          socket.emit( 'res-feeds', res );
        } );
      } );

      socket.on( 'req-feeds-count', function( req ) {
        Notification.count({
          to: {
            elemMatch: {
              mail: details.mail
            }
          }
        }, function(err, res ) {   
          socket.emit( 'res-feeds-count', res );
        } );
      } );

      socket.on( 'req-feeds-unread-count', function( req ) {
        Notification.count({
          to: {
            elemMatch: {
              mail: details.mail
            }
          },
          toBeRead: true
        }, function(err, res ) {   
          socket.emit( 'res-feeds-unread-count', res );
        } );
      } );


      socket.on( 'req-make-read', function( req ) {
        Notification.update( {
          id:req.id
        }, {toBeRead: false});
      } );

      
      socket.on( 'disconnect', function(){

        if( current.length <= 1 ) {
          delete( current  );  
        } else {
          index = current.indexOf( socket.id );
          if( index === -1 ) {
            current.splice( index, 1);
          }
        }
      });
    
    }

  });
};


module.exports = appSocket; 