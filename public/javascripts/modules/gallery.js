(function(angular) {
    angular.module('gallery', ['commonModule', 'markdownModule', 'appTileModules', 'appsControllerModule', 'searchAppModule']);
    angular.bootstrap(document, ['gallery']);
})(angular);
