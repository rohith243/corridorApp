define([
    'angular',
    'angular-animate',
    'angular-aria',
    'angular-material',
    'services/http-service',
    'directives/global-nav-directive'
], 
function(
    angular,
    animate,
    aria,
    material,
    httpService,
    globalNav
){
    
    return {
      init: function() {
            httpService.init();
            globalNav.init();
            angular.module('commonModule', ['ngMaterial', 'httpService', 'globalNavigation'])
            .factory('model', [function() {            
                var data = {
                    pageTitle: 'Home'
                };
                return data;
            }])
            .directive( 'pageTitle', function() {
                return {
                    template: '{{model.pageTitle}} | LetsBuild',
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
