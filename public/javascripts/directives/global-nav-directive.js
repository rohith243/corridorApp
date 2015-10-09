if ( typeof window.GLOBAL === 'undefined' ) {
    window.GLOBAL = {};
}
(function(angular) {
    angular.module('globalNavigation', [])
        .directive('globalNav', [function() {
            return {
                templateUrl: '/partials/global-navigation.html',
                restict: 'A',
                scope: {},
                controller: 'globalNavCtrl',
                link: function  ( scope, ele, attr ) {
                    //angular.element( 'body' ).prepend( ele );
                }
            };
        }])
        .controller('globalNavCtrl', function($scope, http) {
            $scope.signinurl = '/signin?redirect=' + window.location.pathname;
            if ( GLOBAL.user ) {
                $scope.username = GLOBAL.user.firstname;
            }
            $scope.logout = function(e) {
                e.preventDefault();
                http.get('/services/logout')
                    .then(function(res) {
                        window.location = '/';
                    });
            };
            $scope.openMenu = function( e ) {
                e.preventDefault();
                angular.element( 'body' ).addClass( 'menu-opened' )
            }
            $scope.closeMenu = function( e ) {
                e.preventDefault();
                angular.element( 'body' ).removeClass( 'menu-opened' )   
            }
        })
        ;
})(angular);
