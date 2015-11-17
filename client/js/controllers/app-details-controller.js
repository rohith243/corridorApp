define([
  'jquery',
  'angular',
  'modules/markdown',
  'vendors//jquery.easing.min',
  'controllers/express-interest-controller'
], 
function(
    $,
    angular,
    markdown,
    easein,
    expressInterest
){
    var openSinginWarning = function($mdDialog, e) {
        var confirm = $mdDialog.confirm()
            .title('You have not signin Please sign.')
            .content('It seems you are not signed in please signin')
            .ariaLabel('Signin here')
            .targetEvent(e)
            .ok('signin here')
            .cancel('Ignore');
        $mdDialog.show(confirm).then(function() {
            window.location =  './signin?redirect=' + location.pathname + location.hash;
        }, function() {
            return;
        });
    };

    angular.module( 'letsBuild' )
    .controller( 'appDetailsController',[
        '$scope',
        'http',
        'Notification',
        '$stateParams',
        'model',
        '$mdDialog',
        function  (
            $scope,
            http,
            Notification,
            $stateParams,
            model,
            $mdDialog
        ) {
            
            var id = $stateParams.id;
            model.id = id;
            $scope.user = GLOBAL.user;
            http.get(  'api/apps/getApp?id=' + id )
            .then( function( res ) {
                $scope.item = res;
                model.item = $scope.item;
                $scope.item.likes = res.likes || [];
                $scope.item.interests = res.interests || [];
                $scope.shareConfig = {
                    defaultMessage: 'LetsBuild : ' + res.appName,
                    pageUrl: document.URL
                }
            });
            $scope.updateLikes = function( e ) {
                e.preventDefault();
                if( $scope.user ) {
                    http.get( 'api/apps/toggleVote?id=' + id )
                    .then( function( res ) {
                        $scope.item.likes = res.likes;
                        Notification.success( 'Updated success fully' );
                    } );    
                } else {
                    openSinginWarning($mdDialog, e );
                }
            };

            $scope.expressInterestDetails = function( e ) {
                
                e.preventDefault();
                if( $scope.user ) {
                    var parentEl = angular.element(document.body);
                    $mdDialog.show({
                        parent: parentEl,
                        targetEvent: e,
                        templateUrl:  'partials/express-interest.html',
                        controller: 'expressInterestController',
                    });
                } else {
                    openSinginWarning($mdDialog, e );   
                }

            };
            
            $scope.isContributorsAvailable = function( interestedPeople ) {
                if ( interestedPeople ) {
                    for (var index in interestedPeople ) {
                        if ( interestedPeople[index].isContributor ) {
                            return true;
                        }
                    }
                }
            };

            $scope.isEditExpress = function() {
            
                if( !$scope.user ) {
                    return false
                } 
                var interests = $scope.item.interests;
                for ( var user in interests ) {
                    if (interests[user].mail === $scope.user.mail) {
                        return true;
                    }
                }
            };

            $scope.unExpressInterest = function( e ) {
                
                e.preventDefault();
                if( confirm( 'Do you want to unexpress?' ) ) {
                    http.get( 'api/apps/unExpressInterest?id=' + id )
                    .then( function( res ) {
                        Notification.success( 'successfully Removed' );
                        $scope.item.interests = res.interests;
                    } )    
                }
                
            }


        }            
    ] );
    $( window ).scroll( function  (argument) {
        if( $( '.section-content' ).length ) {
            var win = $( this );
            var top = $( '.section-content' ).offset().top - win.scrollTop() ;
            if( top < 20  ) {
                $( '.section-navigator' ).css( 'top', -top + 20 );
            } else {
                $( '.section-navigator' ).css( 'top', '' );
            }
            
            $( '.info-section' ).each( function( index, ele ) {
                var dim = ele.getBoundingClientRect();
                if( dim.top - 75 < 0  && dim.bottom > 0 )  {
                    $( '.page-navigator-link li' ).removeClass( 'active-link' );
                    $( '#' + ele.id + '-li' ).addClass( 'active-link' );
                }
            } );    
        }
        
    } );
    setTimeout( function() {
        $( '.page-navigator-link a' ).click( function( e ) {
            e.preventDefault();
            var id = $(this).attr( 'href' );
            $("html, body").animate(
                {
                    scrollTop: $( id ).offset().top - 50 + 'px'
                } ,
                1500 ,
                'easeInOutQuint'
            )
        } );    
    }, 1000 )
    
})
