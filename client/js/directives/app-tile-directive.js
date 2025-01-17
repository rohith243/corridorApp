define([
  'angular',
  'jquery'
], 
function(
    angular,
    $
){
    
    var init = function() {
        angular.module( 'letsBuild' )
        .directive('appTile', [function() {
            return {
                templateUrl:  './partials/app-tile.html',
                restict: 'A',
                scope: {
                    item: '=',
                    mode: '='
                },
                controller: 'appTileController'
            };
        }])
        .directive('appTileEdit', [function() {
            return {
                templateUrl:  './partials/app-tile-edit.html',
                restict: 'A',
                scope: {
                    item: '=',
                    mode: '=',
                    key: '=',
                    index: '=',
                    reArrangeApps: '='
                },
                controller: 'appTileController'
            };
        }])
        .controller( 'appTileController', [
            '$scope',
            'model',
            'http',
            'Notification',
            function( $scope,model,http,Notification ) {
                $scope.deleteItem = function(  e ,item ) {
                    e.preventDefault();
                    http.get( './api/apps/deleteApp?id=' + item.id )
                    .then( function( res ) {
                        Notification.success( 'Deleted' );
                        var index = model.appResponse.indexOf( item );
                        if( index != -1 ) {
                            model.appResponse.splice( index, 1 );
                        }
                        if( $scope.reArrangeApps ) {
                            $scope.reArrangeApps();    
                        }
                        
                    } )
                
                };

                $scope.togglePublish = function(  e ,item ) {

                    e.preventDefault();
                    if (item.appName && item.solution) {
                        http.post( './api/apps/updateApp', {
                            postData: {
                                isPublish : !item.isPublish,
                                id: item.id
                            }
                        })
                        .then(function(res) {
                            item.isPublish = res.isPublish;
                            Notification.success('successfully updated');
                            if( $scope.reArrangeApps ) {
                                $scope.reArrangeApps();    
                            }
                        });
                    }
                    else {
                        Notification.error('Fill required details and then publish');
                    }
                
                };

                $scope.getEffortFunded = function(item) {
                    
                    if( typeof item.accumlatedEffort !== 'undefined' ) {
                        return item.accumlatedEffort;
                    } 
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

                $scope.checkInterested = function() {
                    if( !GLOBAL.user ) {
                        return false;
                    }

                    var interests = $scope.item.interests;
                    for( var item in  interests ) {
                        if( GLOBAL.user.mail === interests[ item ].mail ) {
                            return true;
                        }
                    }
                    
                };

                $scope.toggleFeature = function( e, item) {
                    e.preventDefault();
                    if( !GLOBAL.user && !GLOBAL.user.admin ) {
                        return false;
                    }
                    item.featured = !item.featured;
                    http.post( './api/apps/toggleFeature', {
                        postData: {
                            featured : item.featured,
                            id: item.id
                        }
                    })
                    .then(function(res) {
                        Notification.success('successfully updated');
                        if( $scope.reArrangeApps ) {
                            $scope.reArrangeApps();    
                        }
                    });
                    
                };
            }
        ] )
    };

    return {
        init: init 
    };
    
});

