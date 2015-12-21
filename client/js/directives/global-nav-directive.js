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
                    templateUrl:  './partials/global-navigation.html',
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
            .controller('globalNavCtrl', function($scope, http, navMenu, $location, Notification, model) {
                $scope.signinurl = './signin';
                $scope.openMenu = navMenu.openMenu;
                $scope.closeMenu = navMenu.closeMenu;
                model.notification = {};
                $scope.notification = model.notification;
                $scope.notification.count = 0; 
                $scope.user = GLOBAL.user;
                $scope.logout = function( e ) {
                  e.preventDefault();
                  http.get( './services/logout' )
                  .then( function() {
                    $scope.user = null;
                    GLOBAL.user = null;
                  } );
                  window.location = "//cev3.pramati.com/cas/logout?service=" + location.origin + location.pathname;

                };

                $scope.signIn = function( e ) {

                    e.preventDefault();
                    localStorage.setItem( 'stateUrl', $location.path() );
                    window.location = $scope.signinurl;
                };

                if( GLOBAL.user ) {
                    
                    require( ['modules/socket'], function( socket ) {
                        
                        socket = socket.getSocket();
                        if( socket ){
                            //socket.emit( 'req-feeds', { from: 0, to: 50 } );
                            socket.emit( 'req-feeds-unread-count' );
                            
                            socket.on( 'res-feeds-unread-count', function( res ) {
                                console.log( 'count', res );
                                $scope.notification.count = res;
                            } );


                            socket.on( 'new-feed', function( res ) {

                                $scope.notification.count++;
                                Notification.success({
                                    message: res.appName + ' updated' , 
                                    positionY: 'bottom', 
                                    positionX: 'left',
                                    templateUrl: './partials/ui-notification.html'
                                });

                            } );
                                
                        }
                        

                    } );
                }

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
