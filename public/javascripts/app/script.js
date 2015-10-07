var app = angular.module('app', [ 'ngMaterial', 'ngAnimate', 'ngSanitize', 'btford.markdown', 'httpService', 'notification', 'signin']);
app.controller('appsController', [
        '$scope',
        '$http',
        'model',
        'Notification',
        'http',
        function(
            $scope,
            $http,
            model,
            Notification,
            http
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
                    $scope.apps.favourites = GLOBAL.featuredApps || [];
                    var len = $scope.apps.favourites.length;
                    var fav;
                    var data;
                    var findFunction = function(app) {
                        return app._id === fav._id;
                    };
                    if (len) {
                        for (var i = 0; i < $scope.apps.favourites.length; i++) {
                            fav = $scope.apps.favourites[i];
                            data = _.find(res.data, findFunction);
                            if (data) {
                                $scope.apps.favourites[i] = data;
                            } else {
                                $scope.apps.favourites.splice(i, 1);
                                i--;
                            }
                        }
                    }
                });
            $scope.searchpop = function(argument) {
                openSearchApps();
            };
            $scope.deleteItem = function(e, item, index, key) {
                e.preventDefault();
                if (confirm('do you want to delete' + item.name + '?')) {
                    if( key === 'proposed' ) {
                        http.get('services/deletedoc?cname=letsbuild&_id=' + item._id)
                          .then(function(res) {
                              $scope.apps[key].splice(index, 1);
                              Notification.success( 'app successfully deleted' );
                          });      
                    } else {
                        $scope.apps[key].splice(index, 1);
                        Notification.success('app deleted from favourites');
                    }
                  
                }
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
    }])
    .directive('appTile', [function() {
        return {
            templateUrl: '/partials/app-tile.html',
            restict: 'A',
            scope: {
                item: '=',

            }
        }
    }])
    .directive('appTileEdit', [function() {
        return {
            templateUrl: '/partials/app-tile-edit.html',
            restict: 'A',
            scope: {
                item: '=',
                deleteItem: '=',
                key : '=',
                index: '='
            }
        }

    }]);;

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
