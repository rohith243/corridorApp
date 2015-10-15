(function(angular) {
    angular.module('appTileModules', [])
        .directive('appTile', [function() {
            return {
                templateUrl: basePath + 'partials/app-tile.html',
                restict: 'A',
                scope: {
                    item: '=',
                    getEffortFunded: '='
                },
                controller: ['$scope',function($scope) {
                    $scope.basePath = basePath;
                }]
            };
        }])
        .directive('appTileEdit', [function() {
            return {
                templateUrl: basePath + 'partials/app-tile-edit.html',
                restict: 'A',
                scope: {
                    item: '=',
                    deleteItem: '=',
                    getEffortFunded: '=',
                    togglePublish: '=',
                    key: '=',
                    index: '='
                },
                controller: ['$scope',function($scope) {
                    $scope.basePath = basePath;
                }]
            };
        }])
        .directive('appTileAdmin', [function() {
            return {
                templateUrl: basePath + 'partials/app-tile-admin.html',
                restict: 'A',
                scope: {
                    item: '=',
                    getEffortFunded: '=',
                    togglePublish: '=',
                    key: '=',
                    index: '='
                },
                controller: ['$scope','model','http','Notification',function($scope,model,http,Notification) {
                    $scope.basePath = basePath;
                    $scope.deleteItem= function( e, item, index, key ) {
                        e.preventDefault();
                        if (confirm('do you want to delete "' + item.appName + '" ?')) {
                            http.get( basePath + 'services/deleteAdmin?_id=' + item._id)
                                .then(function(res) {
                                    for (var i in model.appResponse ) {
                                        if (item._id === model.appResponse[i]._id) {
                                            model.appResponse.splice(i, 1);
                                        }
                                    }
                                    Notification.success('app successfully deleted');
                                });
                        }
                    };
                }]
            };
        }]);
})(angular);
