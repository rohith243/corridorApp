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
                        ele.find( '#aside-nav' ).on( 'click', 'a',  function( e ) {
                            scope.closeMenu();
                        } );
                        document.body.appendChild( document.getElementById( 'aside-nav' ) );
                        document.body.appendChild( document.getElementById( 'opened-page-mask' ) );
                    }
                };
            }])
            .controller('globalNavCtrl', function($scope, http,  $state) {
                $scope.signinurl = 'signin?redirect=./'
                $scope.openMenu = function( e ) {
                    e.preventDefault();
                    document.body.classList.add( 'open-navigation' );
                    //angular.element( 'body' ).addClass(  );
                };
                $scope.closeMenu = function( e ) {
                    e&&e.preventDefault();
                    document.body.classList.remove( 'open-navigation' );
                    //angular.element( 'body' ).removeClass( 'open-navigation' );   
                };

                $scope.user = GLOBAL.user;
                $scope.logout = function( e ) {
                  e.preventDefault();
                  http.get( 'services/logout' )
                  .then( function() {
                    $scope.user = null;
                    GLOBAL.user = null;
                  } );
                  window.location = "//cev3.pramati.com/cas/logout?service=" + document.URL;

                }
            });
        }
    }
} );
