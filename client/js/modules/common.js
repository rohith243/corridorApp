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
    var checkFeatureRequest;
    var checkFeatureResponse = {};

    var tempImages = {
        'apurba.n@imaginea.com':   './images/apurba.jpg',
        'jay.pullur@pramati.com':  './images/jay.jpg',
        'vijay@pramati.com':  './images/vijay.jpg',
        'chandru@pramati.com':  './images/chandru.jpg',
        'sharad.s@imaginea.com':  './images/sharad.jpg',
        'kvp@pramati.com':  './images/kvp.jpg'
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
            .filter('commentGetImages', function() {
              return function( inputArray ) {
                if( !inputArray ) {
                    return [];
                }
                for( var i = 0; i < inputArray.length; i++ ) {
                    if( tempImages[ inputArray[i].commenter.mail ] ) {
                        inputArray[i].commenter.src = tempImages[ inputArray[i].commenter.mail ];
                    }
                }
                return inputArray;
              };
            })
            .directive( 'checkFeature', [
                function() {
                    return {
                        restrict: 'A',
                        controller: [
                            
                            '$scope',
                            'http',
                            '$attrs',
                            '$element',

                            function( $scope, http, $attrs, $element ) {

                                var key = $attrs.checkFeature;
                                var udetails = GLOBAL.user;
                                checkFeatureResponse = {};
                                http.get( './api/features/allFeatureConfigs' )
                                .then( function( res ) {
                                    for( var i = 0; i < res.length; i++ ) {
                                        if( res[ i ].open === 'all' )
                                            checkFeatureResponse[ res[i].featureKey ] = true;
                                        else if( res[ i ].open === 'none' ) 
                                            checkFeatureResponse[ res[i].featureKey ] = false;
                                        else if( res[ i ].list ) {
                                            if( udetails &&  udetails.mail )
                                                checkFeatureResponse[ res[i].featureKey ] =  res[ i ].list.indexOf( udetails.mail ) !== -1;
                                        } else {
                                            checkFeatureResponse[ res[i].featureKey ] =  false;
                                        }
                                    }
                                } );

                                $scope.$watch( function() {
                                    return checkFeatureResponse[ key ];
                                }, function( newVal ) {
                                    if( newVal ) {
                                        $element.show();
                                    } else {
                                        $element.hide();
                                    }
                                }  );
                            }
                        ]
                    }
                }
            ] )
            .directive('yammerShare', [
                function() {
                    return {
                        restrict: 'A',
                        scope: {
                            shareConf: '='
                        },
                        link: function(scope, ele) {
                            ele.click( function( e ) {
                                e.preventDefault();
                                require( [ 'yammer' ] , function( yam ) {
                                    var shareConf = scope.shareConf ||  {
                                        defaultMessage : 'LetsBuild :',
                                        pageUrl: document.URL
                                    };
                                    yam.platform.yammerShareOpenPopup( shareConf );
                                } )
                            } )
                        }
                    }
                } 
            ] )
        }  
    };
});
