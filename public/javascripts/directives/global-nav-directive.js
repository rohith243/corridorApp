if ( typeof window.GLOBAL === 'undefined' ) {
    window.GLOBAL = {};
}
(function(angular) {
    angular.module('globalNavigation', [])
        .directive('globalNav', [function() {
            return {
                templateUrl: basePath + 'partials/global-navigation.html',
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

            $scope.basePath = basePath;


            $scope.signinurl = basePath + 'signin?redirect=' + window.location.pathname;
            if ( GLOBAL.user ) {
                $scope.username = GLOBAL.user.firstName;
                $scope.admin = GLOBAL.user.admin;
            }
            $scope.logout = function(e) {
                e.preventDefault();
                http.get( basePath + 'services/logout' )
                    .then(function(res) {
                        window.location = "//cev3.pramati.com/cas/logout?service=" + document.URL;
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
