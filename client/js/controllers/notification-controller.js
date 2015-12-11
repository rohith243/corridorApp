define([
  'jquery',
  'angular',
  'jsoneditor',
  'modules/socket'
], 
function(
    $,
    angular,
    JSONEditor,
    msocket
){
    angular.module( 'letsBuild' )
    .controller( 'notificationController', [
        '$scope',
        'http',
        'model',
        function  (
            $scope,
            http,
            model
        ) {
            var page = 1;
            var size = 10;
            var socket = msocket.getSocket();
            $scope.notifications = [];
            $scope.totalCount = 0;
            if( socket ){
                socket.emit( 'req-feeds' );
                socket.emit( 'req-feeds-count' );
                socket.off( 'res-feeds' );
                socket.on( 'res-feeds', function( res ) {
                    if( !$scope ) {
                        return;
                    }
                    $scope.notifications = $scope.notifications.concat( res );
                    var index, j, user = GLOBAL.user;
                    if( user ) {
                        for( len = res.length-1 ; len>=0 ; len-- ) {
                            if( res[ len].to ) {
                                for( j = res[ len ].to.length-1; j>=0 ; j-- ) {
                                    if( res[ len ].to[ j ].mail === user.mail &&  res[ len ].to[ j ].toBeRead ) {
                                        res[ len ].toBeRead = true;
                                        break;
                                    }
                                }    
                            }
                            
                        }    
                    }
                    

                    $scope.$apply();
                } );
                socket.off( 'res-feed' );
                socket.on( 'new-feed', function( res ) {
                    if( !$scope ) {
                        return;
                    }
                    $scope.notifications.unshift( res );
                    $scope.totalCount++;
                    $scope.$apply();
                } );
                socket.off( 'res-feeds-count' );
                socket.on( 'res-feeds-count', function( res ) {
                    if( !$scope ) {
                        return;
                    }
                    $scope.totalCount = res;
                    $scope.$apply();
                } );
    
            }
            
            $scope.loadmore = function( e ) {
                e.preventDefault();
                page++;
                socket.emit( 'req-feeds', {
                    page: page,
                    size: size
                } );

            };

            $scope.makeRead = function( item ) {
                if( item && item.toBeRead ) {
                    item.toBeRead = false;
                    model.notification.count--;
                    socket.emit( 'req-make-read' , {
                        id: item.id
                    } )
                }
            };

        
        } 
    ] )
    
    
})
