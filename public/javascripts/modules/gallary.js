;
(function(angular) {
    var app = angular.module('gallary', ['commonModule', 'appTileModules', 'appsControllerModule', 'searchAppModule'])
    angular.bootstrap(document, ['gallary']);
})(angular);
