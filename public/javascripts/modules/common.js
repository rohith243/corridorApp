(function(angular) {
    if(typeof path === 'undefined' ) {
        path = '';
    }
    var tempImages = {
        'apurba.n@imaginea.com':  '/images/apurba.jpg',
        'jay.pullur@pramati.com': '/images/jay.jpg',
        'vijay@pramati.com': '/images/vijay.jpg',
        'chandru@pramati.com':'/images/chandru.jpg',
        'sharad.s@imaginea.com':'/images/sharad.jpg',
        'kvp@pramati.com': '/images/kvp.jpg'
    };

    angular.module('commonModule', ['ngMaterial', 'httpService', 'globalNavigation','headroom'])
        .factory('model', [function() {
            var data = {};
            return data;
        }])
        .filter('getImages', function() {
          return function( inputArray ) {
            if( !inputArray ) {
                return []
            }
            for( var i = 0; i < inputArray.length; i++ ) {
                if( tempImages[ inputArray[i].mail ] ) {
                    inputArray[i].src = tempImages[ inputArray[i].mail ];
                }
            }
            return inputArray;
          };
        });
})(angular);
