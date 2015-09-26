var app = angular.module('app', ['ui.bootstrap', 'ngAnimate', 'ngSanitize', 'btford.markdown']);
app.controller('appsController', [
        '$scope',
        '$http',
        'model',
        function(
            $scope,
            $http,
            model
        ) {
            $scope.category = serviceConfig.app.key;
            $http.get(serviceConfig.app.url)
                .then(function(res) {
                    var key = serviceConfig.app.key;
                    model.appResponse = res.data;
                    $scope.apps = {};
                    $scope.apps[key] = res.data;
                    $scope.limit = {};
                    $scope.limit[key] = 8;
                    $scope.featuredApps = GLOBAL.featuredApps || [];
                    var len = $scope.featuredApps.length;
                    var fav;
                    var data;
                    var findFunction = function(app) {
                        return app._id === fav._id;
                    };
                    if (len) {
                        for (var i = 0; i < $scope.featuredApps.length; i++) {
                            fav = $scope.featuredApps[i];
                            data = _.find(res.data, findFunction);
                            if (data) {
                                fav.data = data;
                            } else {
                                $scope.featuredApps.splice(i, 1);
                                i--;
                            }
                        }
                    }
                });
            $scope.searchpop = function(argument) {
                openSearchApps();
            };
        }
    ])
    .controller('searchPopCtrl', [
        '$scope',
        'model',
        '$filter',
        function(
            $scope,
            model,
            $filter
        ) {
            $scope.category = serviceConfig.app.key;
            $scope.filteredApps = function() {
                if ($scope.searchText) {
                    return $filter('filter')(model.appResponse && model.appResponse, $scope.searchText);
                } else {
                    return [];
                }
            };
        }
    ])
    .factory('model', [function() {
        var data = {};
        return data;
    }]);
$(function(argument) {
    angular.bootstrap(document, ['app']);
    $('#app-search-popup-close').click(function(e) {
        e.preventDefault();
        closeSearchApps();
    });
});
var closeSearchApps = function() {
    $(document).off('keydown.opensearch');
    $('body').removeClass('app-search-opened');
    $('body').focus();
};
var openSearchApps = function(argument) {
    $(document).on('keydown.opensearch', function(e) {
        if (e.keyCode === 27) {
            closeSearchApps();
        }
    });
    $('body').addClass('app-search-opened');
    $('#search-app').focus();
};
