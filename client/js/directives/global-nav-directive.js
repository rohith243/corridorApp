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
            .controller('globalNavCtrl', function($scope, http,  $state, $stateParams, navMenu) {
                $scope.signinurl = 'signin?redirect=./';
                $scope.openMenu = navMenu.openMenu;
                $scope.closeMenu = navMenu.closeMenu;

                $scope.user = GLOBAL.user;
                $scope.logout = function( e ) {
                  e.preventDefault();
                  http.get( 'services/logout' )
                  .then( function() {
                    $scope.user = null;
                    GLOBAL.user = null;
                  } );
                  window.location = "//cev3.pramati.com/cas/logout?service=" + document.URL;

                };

                $scope.signIn = function( e ) {

                    e.preventDefault();
                    localStorage.setItem( 'stateUrl', $state.current.url );
                    window.location = $scope.signinurl;
                };
            })
            .service( 'navMenu', [ 'Notification', function( Notification ) {
                var navMenu = {};
                navMenu.openMenu = function( e, warning ) {
                    if( e ) {
                        e.preventDefault();    
                    }
                    document.body.classList.add( 'open-navigation' );

                    if( warning ) {
                        Notification.error( 'Please login to continue'  );
                    }
                };
                navMenu.closeMenu = function( e ) {
                    if( e ) {
                        e.preventDefault();    
                    }
                    document.body.classList.remove( 'open-navigation' );
                };
                return navMenu;
            }] );
        }
    }
} );
