(function(angular) {
    angular.module('commonModule', ['ngMaterial', 'httpService', 'signInTileModule','headroom'])
        .factory('model', [function() {
            var data = {};
            return data;
        }]);
})(angular);
