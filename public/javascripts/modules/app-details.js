(function(angular) {
    angular.module('appDetails', ['commonModule', 'markdownModule', 'appsDetailCtrlModule', 'expressInterestModule'])
        .filter('trustAsResourceUrl', ['$sce', function($sce) {
            return function(val) {
                return $sce.trustAsResourceUrl(val);
            };
        }]);
    angular.bootstrap(document, ['appDetails']);
})(angular);
