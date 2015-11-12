define([
  'angular'
], 
function(
    angular
){
    angular.module('letsBuild').controller( 'editTodoController', [ 
        '$scope',
        'http',
        'Notification',
        '$state',
        '$stateParams',
        'model',
        function( $scope, http , Notification, $state, $stateParams, model ) {
            if( !GLOBAL.user ) {
                $state.go( 'default' );
            }
            var id =  $stateParams.id;
            model.pageTitle = 'Edit app';
            
            http.get( './api/apps/getApp?id=' + id )
            .then( function( res ) {
                $scope.app = res;
            } );

            $scope.updateApp = function( e ) {
                e.preventDefault();
                if( $scope.appForm.$valid ) {
                    http.post( './api/apps/updateApp', {
                        postData: $scope.app
                    } )
                    .then( function( res ) {
                        Notification.success( 'Item Updated' );
                        $state.go( 'myApps' );
                    } );
                }
            };
        }
    ] )
    
})
