define([
  'angular'
], 
function(
    angular
){
    
    angular.module('letsBuild').controller( 'allTodoController', [
        '$scope',
        'http',
        'model',
        '$state',
        function(
            $scope,
            http,
            model,
            $state
        ) {
            
            model.pageTitle = 'All apps';
            http.get( './api/apps/publishedApps')
            .then( function( res ) {
                $scope.apps = res;
            } );
        } 
    ] );
    
})
