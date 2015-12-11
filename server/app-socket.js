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
              mail: details.mail,
              toBeRead: true
            }
          }
        }, function(err, res ) {   
          socket.emit( 'res-feeds-unread-count', res );
        } );
      } );


      socket.on( 'req-make-read', function( req ) {
        Notification.findById( req.id, function( err, doc ) {          
          if( doc && doc.to ) {
            for( var len = doc.to.length-1; len >= 0; len-- ) {
              if( doc.to[ len].mail === details.mail ) {
                doc.to[ len ].toBeRead = false;
                doc.updateAttributes( {
                  to: doc.to
                });
                break;
              }  
            }
          }
        } );
      } );

      socket.on( 'disconnect', function(){

        if( current && current.length <= 1 ) {
          delete( current  );  
        } else {
          index = current.indexOf( socket.id );
          if( index === -1 ) {
            current.splice( index, 1);
          }
        }
      });
    
    }
    
    var Comment = app.models.Comment;
    
    socket.on( 'req-comments', function( req ) {
      Comment.find({
        where: {
          pageId: req.pageId
        }
      }, function(err, res ) {
        socket.emit( 'res-comments', res );
      } );
    });

    socket.on( 'post-comment', function( req ) {
      if( !details && typeof req.obj === 'object') {
        return;
      }
      var obj = req.obj;
      obj.commenter = details;
      obj.createdAt = +new Date();
      Comment.create( req.obj );
    });

    socket.on( 'post-inner-comment', function( req ) {
      if( !details && typeof req.obj === 'object' ) {
        return;
      }
      var commentId = req.obj.commentId;
      Comment.findById( commentId, function( err, doc ) {
        if( doc ) {
          doc.children = doc.children || [];
          var comment = req.obj;
          comment.commenter = details;
          comment.createdAt = +new Date();
          doc.children.push( comment );   
          doc.updateAttributes( {
            children: doc.children
          });  
        }
        
      } );
    });

    socket.on( 'req-remove-inner-comment', function( req ) {
      if( !details ) {
        return;
      }
      var commentId = req.commentId;
      Comment.findById( commentId, function( err, doc ) {
        doc.children = doc.children || [];
        for( var i=0 ; i < doc.children.length; i++ ) {
          if( doc.children[i].createdAt === req.createdAt ) {
            if( details.mail === doc.children[i].commenter.mail )
              {
                doc.children.splice( i, 1);
              }
            break;
          }
        }
        doc.updateAttributes( {
          children: doc.children
        });
      } );
    });

    socket.on( 'req-remove-comment', function( req ) {
      if( !details && typeof req.obj === 'object' ) {
        return;
      }
      var commentId = req.commentId;
      Comment.findById( commentId, function( err, doc ) {
        if( doc.commenter.mail === details.mail ) {
          Comment.destroyById( commentId );
        }
      } );
    });


  });
};


module.exports = appSocket; 