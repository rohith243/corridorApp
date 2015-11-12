define([
  'angular'
], 
function(
    angular
){
    angular.module('letsBuild').controller( 'myTodoController', [ 
        '$scope',
        'http',
        'Notification',
        'model',
        '$state',
        function( $scope, http , Notification, model, $state) {
            if( !GLOBAL.user ) {
                $state.go( 'default' );
            }
            $scope.apps = [];
            model.pageTitle = 'My apps';
            http.get( './api/apps/myApps')
            .then( function( res ) {
                $scope.apps = res;
            } );

            $scope.addTodo = function( e ) {
                e.preventDefault();
                if( $scope.appForm.$valid ) {
                    $scope.item.isPublished = true;
                    http.post( './api/apps/createApp', {
                        postData: $scope.item
                    } )
                    .then( function( res ) {
                        Notification.success( 'app Item addedd' );
                        $scope.apps.push( res );
                        $scope.item = {};
                        $scope.appForm.$setPristine();
                    } )
                }
            };
            $scope.deleteApp = function( e, index, app ) {
                e.preventDefault();
                if( confirm( 'Are you sure to delete "' + app.text + '" ?' ) ) {
                    http.get( './api/apps/deleteApp?id=' + app.id )
                    .then( function( res ) {
                        Notification.success( 'Deleted' );
                        $scope.apps.splice( index, 1 );
                    } );    
                }
                

            };
            $scope.togglePublish = function(  appItem ) {

                http.post(  './api/apps/updateApp',{
                    postData: appItem
                } )
                .then( function( res ) {
                    if( appItem.isPublished ) {
                        Notification.success( 'successfully Published' )    
                    } else {
                        Notification.success( 'successfully unpublished' )    
                    }
                    
                }, function() {
                    appItem.isPublished = !appItem.isPublished;
                } );
            }
        }
    ])
    
})
