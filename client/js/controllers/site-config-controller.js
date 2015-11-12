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
    
    
    angular.module( 'todoApp' )
    .controller( 'siteConfigController', [
        '$scope',
        'http',
        'Notification',
        function  (
            $scope,
            http,
            Notification
        ) {
            http.get( './services/getSiteConfig' )
            .then( function( res ) {
                $scope.config = res;   
            } );
            
            $scope.updateConfig = function( e ) {
                
                e.preventDefault();
                http.post( './services/updateSiteConfig', {
                    postData: {
                        data: $scope.config 
                    }
                } )
                .then( function( res ) {
                    Notification.success( 'Configurations Updated Successfully' );
                });
            };
        } 
    ] )
    
})
