(function(angular) {
    // in future remove this method as it is already available in apps-controller.js
    var closeSearchApps = function() {
        $(document).off('keydown.opensearch');
        $('body').removeClass('app-search-opened');
        $('body').focus();
    };
    angular.module('searchAppModule', [])
        .directive('searchApp', [function() {
            return {
                templateUrl: '/partials/app-overlay.html',
                restict: 'A',
                scope: {
                    isEdit: '='
                },
                controller: 'searchOverlayController',
                link: function( scope, ele ) {
                    $('#app-search-popup-close',ele).click(function(e) {
                        e.preventDefault();
                        closeSearchApps();
                    });
                }
            };
        }])
        .controller('searchOverlayController', [
            '$scope',
            'model',
            '$filter',
            'http',
            'Notification',
            '$timeout',
            function(
                $scope,
                model,
                $filter,
                http,
                Notification,
                $timeout
            ) {
                $scope.allFilteredApps = [];

                $scope.filteredApps = function() {

                    if ($scope.searchText) {

                        return $filter('filter')(model.appResponse && model.appResponse, $scope.searchText);
                    } else {
                        return [];
                    }
                };
                var callFunction = function(){
                    $scope.allFilteredApps = [];
                    var data = $scope.filteredApps();
                    if( !data.length ) {
                        $scope.searchResultZero = true;
                    } else {
                        $scope.allFilteredApps[0] = data[0];
                        for( var i=1; i < data.length; i++ ) {
                            (function( j ){
                                $timeout( function () {
                                    $scope.allFilteredApps.push( data[ j ] ); 
                                }, j*100 );
                            })( i );
                        }
                    }
                };
                var timeoutvar;
                $scope.searchFilter = function() {
                    $scope.searchResultZero = false;
                    $scope.loading = true;
                    $timeout.cancel( timeoutvar );
                    timeoutvar = $timeout( function() {
                        $scope.loading = false;
                        callFunction();
                    }, 500 );
                };
                
                $scope.togglePublish = function(e, item) {
                    e.preventDefault();
                    if (item.appName && item.solution) {
                        http.post('/services/updateDoc', {
                            postData: {
                                data: {
                                    isPublish : !item.isPublish
                                },
                                _id: item._id
                            }
                        })
                        .then(function(res) {
                            item.isPublish = !item.isPublish;
                            Notification.success('successfully updated');
                        });
                    }
                    else {
                        Notification.error('Fill required details and then publish');
                    }
                };
                $scope.deleteItem = function(e, item, index, key) {
                    e.preventDefault();
                    if (confirm('do you want to delete "' + item.appName + '" ?')) {
                        http.get('/services/deleteDoc?_id=' + item._id)
                            .then(function(res) {
                                for (var i in model.appResponse) {
                                    if (item._id === model.appResponse[i]._id) {
                                        model.appResponse.splice(i, 1);
                                    }
                                }
                                Notification.success('app successfully deleted');
                            });
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
                        return "0%";
                    }
                    return effortFundedPerc+"%";
                };
            }
        ]);
})(angular);
