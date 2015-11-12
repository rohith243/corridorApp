define([
  'jquery',
  'angular',
  'jsoneditor'
], 
function(
    $,
    angular,
    JSONEditor
){
    
    
    angular.module( 'letsBuild' )
    .controller( 'adminEditController',[
        '$scope',
        'http',
        'Notification',
        '$stateParams',
        function  (
            $scope,
            http,
            Notification,
            $stateParams
        ) {
            var id = $stateParams.id;
            var container = document.getElementById("jsoneditor");
            var editor = new JSONEditor(container);

            http.get(  'api/apps/getApp?id=' + id )
            .then( function( res ) {
                $scope.item = angular.copy(res);
                $scope.id = $scope.item.id
                delete( $scope.item.id ); //preventing to accidental change id
                originalResponse = res;
                editor.set( $scope.item );

            } );

            $scope.reset = function( e ) {
                e.preventDefault();
                editor.set( originalResponse );
            };

            $scope.update = function( e ) {
                e.preventDefault();
                var postData = editor.get();
                postData.id = $scope.id;
                http.post(  'api/apps/updateApp', {
                    postData: postData
                } )
                .then( function( res ) {
                    $scope.item =  editor.get();
                    Notification.success( 'Updated Successfully' );
                } );
            }
        }            
    ] );
    
})
