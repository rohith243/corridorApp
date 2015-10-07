(function(angular) {
    var openSearchApps = function(argument) {
        $(document).on('keydown.opensearch', function(e) {
            if (e.keyCode === 27) {
                closeSearchApps();
            }
        });
        $('body').addClass('app-search-opened');
        $('#search-app').focus();
    };
    $('#app-search-popup-close').click(function(e) {
        e.preventDefault();
        closeSearchApps();
    });
    var closeSearchApps = function() {
        $(document).off('keydown.opensearch');
        $('body').removeClass('app-search-opened');
        $('body').focus();
    };
    angular.module('appsControllerModule', [])
        .controller('appsController', [
            '$scope',
            'model',
            'Notification',
            'http',
            function(
                $scope,
                model,
                Notification,
                http
            ) {
                $scope.category = serviceConfig.app.key;
                http.get(serviceConfig.app.url)
                    .then(function(res) {
                        var key = serviceConfig.app.key;
                        model.appResponse = res;
                        $scope.apps = {};
                        $scope.apps[key] = res;
                        $scope.limit = {};
                        $scope.limit[key] = 8;
                    });
                $scope.searchpop = function(argument) {
                    openSearchApps();
                };
                $scope.deleteItem = function(e, item, index, key) {
                    e.preventDefault();
                    if (confirm('do you want to delete "' + item.appName + '" ?')) {
                        http.get('/services/deletedoc?cname=letsbuild&_id=' + item._id)
                            .then(function(res) {
                                $scope.apps[key].splice(index, 1);
                                Notification.success('app successfully deleted');
                            });
                    }
                };
            }
        ])
})(angular);
