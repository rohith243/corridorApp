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
            
            socket.emit( 'req-feeds' );
            socket.emit( 'req-feeds-count' );
            socket.on( 'res-feeds', function( res ) {
                $scope.notifications = $scope.notifications.concat( res );
                $scope.$apply();
            } );
            
            socket.on( 'new-feed', function( res ) {
                $scope.notifications.unshift( res );
                $scope.totalCount++;
                $scope.$apply();
            } );
            
            socket.on( 'res-feeds-count', function( res ) {
                $scope.totalCount = res;
                $scope.$apply();
            } );

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
