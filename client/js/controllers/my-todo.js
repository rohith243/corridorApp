define([
  'angular'
], 
function(
    angular
){
    angular.module('todoApp').controller( 'myTodoController', [ 
        '$scope',
        'http',
        'Notification',
        'model',
        '$state',
        function( $scope, http , Notification, model, $state) {
            if( !GLOBAL.user ) {
                $state.go( 'default' );
            }
            $scope.todos = [];
            model.pageTitle = 'My todos';
            http.get( './api/todos/myTodos')
            .then( function( res ) {
                $scope.todos = res;
            } );

            $scope.addTodo = function( e ) {
                e.preventDefault();
                if( $scope.todoForm.$valid ) {
                    $scope.item.isPublished = true;
                    http.post( './api/todos/createTodo', {
                        postData: $scope.item
                    } )
                    .then( function( res ) {
                        Notification.success( 'todo Item addedd' );
                        $scope.todos.push( res );
                        $scope.item = {};
                        $scope.todoForm.$setPristine();
                    } )
                }
            };
            $scope.deleteTodo = function( e, index, todo ) {
                e.preventDefault();
                if( confirm( 'Are you sure to delete "' + todo.text + '" ?' ) ) {
                    http.get( './api/todos/deleteTodo?id=' + todo.id )
                    .then( function( res ) {
                        Notification.success( 'Deleted' );
                        $scope.todos.splice( index, 1 );
                    } );    
                }
                

            };
            $scope.togglePublish = function(  todoItem ) {

                http.post(  './api/todos/updateTodo',{
                    postData: todoItem
                } )
                .then( function( res ) {
                    if( todoItem.isPublished ) {
                        Notification.success( 'successfully Published' )    
                    } else {
                        Notification.success( 'successfully unpublished' )    
                    }
                    
                }, function() {
                    todoItem.isPublished = !todoItem.isPublished;
                } );
            }
        }
    ])
    
})
