define([
  'angular'
], 
function(
    angular
){
    return {
        init: function() {
            angular.module('globalNavigation', [])
            .directive('globalNav', [function() {
                return {
                    templateUrl:  'partials/global-navigation.html',
                    restict: 'A',
                    scope: {},
                    controller: 'globalNavCtrl',
                    link: function  ( scope, ele ) {
                        document.body.appendChild( document.getElementById( 'aside-nav' ) );
                        document.body.appendChild( document.getElementById( 'opened-page-mask' ) );
                    }
                };
            }])
            .controller('globalNavCtrl', function($scope, http) {
                $scope.signinurl = 'signin?redirect=./'
                if ( GLOBAL.user ) {
                    $scope.username = GLOBAL.user.firstName;
                    $scope.admin = GLOBAL.user.admin;
                }
                $scope.logout = function(e) {
                    e.preventDefault();
                    http.get( basePath + 'services/logout' )
                        .then(function(res) {
                            window.location = "//cev3.pramati.com/?custom_normal_logout=1";
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

                $scope.user = GLOBAL.user;
                $scope.logout = function( e ) {
                  e.preventDefault();
                  http.get( './services/signout' )
                  .then( function() {
                    $scope.user = null;
                    GLOBAL.user = null;
                    $state.go( 'default' );
                  } )
                }
            });
        }
    }
} );
