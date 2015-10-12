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
        }]);
})(angular);
