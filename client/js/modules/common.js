define([
    'angular',
    'angular-animate',
    'angular-aria',
    'angular-material',
    'services/http-service'
], 
function(
    angular,
    animate,
    aria,
    material,
    httpService
){
    
    return {
      init: function() {
            httpService.init();
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
