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

    angular.module( 'letsBuild' )
    .controller( 'appDetailsController',[
        '$scope',
        'http',
        'Notification',
        '$stateParams',
        'model',
        '$mdDialog',
        'navMenu',
        function  (
            $scope,
            http,
            Notification,
            $stateParams,
            model,
            $mdDialog,
            navMenu
        ) {
            
            var id = $stateParams.id;
            model.id = id;
            $scope.user = GLOBAL.user;
            http.get(  './api/apps/getApp?id=' + id )
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
                    http.get( './api/apps/toggleVote?id=' + id )
                    .then( function( res ) {
                        $scope.item.likes = res.likes;
                        Notification.success( 'Updated success fully' );
                    } );    
                } else {
                    navMenu.openMenu(e, true);
                }
            };

            $scope.expressInterestDetails = function( e ) {
                
                e.preventDefault();
                if( $scope.user ) {
                    var parentEl = angular.element(document.body);
                    $mdDialog.show({
                        parent: parentEl,
                        targetEvent: e,
                        templateUrl:  './partials/express-interest.html',
                        controller: 'expressInterestController',
                    });
                } else {
                    navMenu.openMenu(e, true);
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
                    http.get( './api/apps/unExpressInterest?id=' + id )
                    .then( function( res ) {
                        Notification.success( 'successfully Removed' );
                        $scope.item.interests = res.interests;
                    } )    
                }
                
            };
            $scope.getEffortFunded = function(item) {
                
                var effortFunded = 0;
                for (var interest in item.interests) {
                    var user = item.interests[interest];
                    if (user.hours && !isNaN(user.hours)) {
                        effortFunded = effortFunded + parseInt(user.hours);
                    }                        
                }
                var effortFundedPerc = Math.floor((effortFunded/item.effort)*100);
                if (isNaN(effortFundedPerc)) {
                    return 0;
                }
                return effortFundedPerc;
            };


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
        $( document ).on('click', '.page-navigator-link a', function( e ) {
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
