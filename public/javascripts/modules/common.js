(function(angular) {
    var tempImages = {
        'kiran.adepu@imaginea.com': 'tempImage',
        'kiran.adepu@imaginea1.com': 'tempImage22'
    };
    angular.module('commonModule', ['ngMaterial', 'httpService', 'globalNavigation','headroom'])
        .factory('model', [function() {
            var data = {};
            return data;
        }])
        .filter('getImages', function() {
          return function( inputArray ) {
            for( var i = 0; i < inputArray.length; i++ ) {
                if( tempImages[ inputArray[i].mail ] ) {
                    inputArray[i].src = tempImages[ inputArray[i].mail ];
                }
            }
            return inputArray;
          };
        });
})(angular);
