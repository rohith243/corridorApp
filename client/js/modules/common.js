define([
    'angular',
    'angular-animate',
    'angular-aria',
    'angular-material',
    'config/notification-config',
    'services/http-service'
], 
function(
    angular,
    animate,
    aria,
    material,
    notificationConfig,
    httpService
){
    return {
      init: function() {
            angular.module('commonModule', ['ngMaterial', 'httpService'])
            .factory('model', [function() {            
                var data = {};
                return data;
            }])
            .directive( 'pageTitle', function() {
                return {
                    controller :[
                        '$scope', 'model', 
                        function( $scope, model ) {
                            $scope.model = model;
                        } 
                    ]
                } 
            })
      }  
    };
});
