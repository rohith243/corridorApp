var app = angular.module('app', ['ui.bootstrap', 'ngAnimate', 'ngSanitize', 'btford.markdown']);
app.controller('letsBuildController', [
        '$scope',
        '$http',
        function(
            $scope,
            $http
        ) {
            var _id;
            var paths = location.pathname.split('/');
            _id = paths[3];
            $http.get('/services/getdocument?cname=letsbuild&_id=' + _id)
                .then(function(res) {
                    $scope.item = res.data;
                });
        }
    ])
    .filter('trustAsResourceUrl', ['$sce', function($sce) {
        return function(val) {
            return $sce.trustAsResourceUrl(val);
        };
    }]);
angular.bootstrap(document, ['app']);
