(function(angular) {
    angular.module('appTileModules', [])
        .directive('appTile', [function() {
            return {
                templateUrl: '/partials/app-tile.html',
                restict: 'A',
                scope: {
                    item: '=',
                    getEffortFunded: '='
                }
            };
        }])
        .directive('appTileEdit', [function() {
            return {
                templateUrl: '/partials/app-tile-edit.html',
                restict: 'A',
                scope: {
                    item: '=',
                    deleteItem: '=',
                    getEffortFunded: '=',
                    togglePublish: '=',
                    key: '=',
                    index: '='
                }
            };
        }]);
})(angular);
