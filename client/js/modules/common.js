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
    var tempImages = {
        'apurba.n@imaginea.com':   'images/apurba.jpg',
        'jay.pullur@pramati.com':  'images/jay.jpg',
        'vijay@pramati.com':  'images/vijay.jpg',
        'chandru@pramati.com':  'images/chandru.jpg',
        'sharad.s@imaginea.com':  'images/sharad.jpg',
        'kvp@pramati.com':  'images/kvp.jpg'
    };
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
            .filter('getImages', function() {
              return function( inputArray ) {
                if( !inputArray ) {
                    return [];
                }
                for( var i = 0; i < inputArray.length; i++ ) {
                    if( tempImages[ inputArray[i].mail ] ) {
                        inputArray[i].src = tempImages[ inputArray[i].mail ];
                    }
                }
                return inputArray;
              };
            })
        }  
    };
});
