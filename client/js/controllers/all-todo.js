define([
  'angular'
], 
function(
    angular
){
    
    angular.module('todoApp').controller( 'allTodoController', [
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
            
            model.pageTitle = 'All todos';
            http.get( './api/todos/publishedTodos')
            .then( function( res ) {
                $scope.todos = res;
            } );
        } 
    ] );
    
})
