(function(angular) {
    if(typeof basePath === 'undefined' ) {
        basePath = '';
    }
    var tempImages = {
        'apurba.n@imaginea.com':  basePath + 'images/apurba.jpg',
        'jay.pullur@pramati.com': basePath + 'images/jay.jpg',
        'vijay@pramati.com': basePath + 'images/vijay.jpg',
        'chandru@pramati.com': basePath + 'images/chandru.jpg',
        'sharad.s@imaginea.com': basePath + 'images/sharad.jpg',
        'kvp@pramati.com': basePath + 'images/kvp.jpg'
    };

    angular.module('commonModule', ['ngMaterial', 'httpService', 'globalNavigation'])
        .factory('model', [function() {            
            var data = {};
            return data;
        }])
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
        .directive( 'checkFeature', [
            function() {
                return {
                    restrict: 'A',
                    controller: [
                        '$scope',
                        'http',
                        function( $scope, http ) {
                            
                            var requestSent = {};
                            $scope.checkFeatureStatus = $scope.checkFeatureStatus || {};
                            $scope.getStatus = function( id ) {
                                if( typeof $scope.checkFeatureStatus[ id ] !== 'undefined' )
                                    return $scope.checkFeatureStatus[ id ];
                                else {
                                    if( requestSent[ id ] ) {
                                        return;
                                    }
                                    requestSent[ id ] = true;
                                    
                                    http.get( basePath + 'services/verifyFeature?_id=' + id )
                                    .then( function( res ) {
                                        $scope.checkFeatureStatus[ id ] = res.status;
                                    }, function() {
                                        requestSent[ id ] = false;
                                    } );

                                }
                                
                            }
                        }
                    ]
                }
            }
        ] );
})(angular);
