(function(angular) {
    angular.module('commonModule', ['ngMaterial', 'httpService', 'globalNavigation','headroom'])
        .factory('model', [function() {
            var data = {};
            return data;
        }]);
})(angular);
