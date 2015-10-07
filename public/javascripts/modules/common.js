;
(function(angular) {
    angular.module('commonModule', ['ngMaterial', 'httpService', 'signInTileModule'])
        .factory('model', [function() {
            var data = {};
            return data;
        }]);
})(angular);
