(function(angular) {
    angular.module('gallary', ['commonModule', 'appTileModules', 'appsControllerModule', 'searchAppModule']);
    angular.bootstrap(document, ['gallary']);
})(angular);
