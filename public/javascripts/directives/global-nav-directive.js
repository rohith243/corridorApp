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
                link: function  ( scope, ele ) {
                    $( 'body' ).prepend( ele.find( '#aside-nav' ) );
                    $( 'body' ).prepend( ele.find( '#opened-page-mask' ) );
                }
            };
        }])
        .controller('globalNavCtrl', function($scope, http) {
            $scope.signinurl = '/signin?redirect=' + window.location.pathname;
            if ( GLOBAL.user ) {
                $scope.username = GLOBAL.user.firstName;
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
                angular.element( 'body' ).addClass( 'open-navigation' );
            };
            $scope.closeMenu = function( e ) {
                e.preventDefault();
                angular.element( 'body' ).removeClass( 'open-navigation' );   
            };
        });
})(angular);
