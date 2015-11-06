define([
  'angular'
], 
function(
    angular
){
    angular.module('todoApp').controller( 'editTodoController', [ 
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
            model.pageTitle = 'Edit todo';
            
            http.get( './api/todos/getTodo?id=' + id )
            .then( function( res ) {
                $scope.todo = res;
            } );

            $scope.updateTodo = function( e ) {
                e.preventDefault();
                if( $scope.todoForm.$valid ) {
                    http.post( './api/todos/updateTodo', {
                        postData: $scope.todo
                    } )
                    .then( function( res ) {
                        Notification.success( 'Item Updated' );
                        $state.go( 'myTodos' );
                    } );
                }
            };
        }
    ] )
    
})
