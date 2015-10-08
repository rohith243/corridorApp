(function(angular) {
    angular.module('gallary', ['commonModule', 'markdownModule', 'appTileModules', 'appsControllerModule', 'searchAppModule']);
    angular.bootstrap(document, ['gallary']);
})(angular);
