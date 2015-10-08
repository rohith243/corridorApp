(function(angular) {
    var openSinginWarning = function($mdDialog, e) {
        var confirm = $mdDialog.confirm()
            .title('You have not signin Please sign.')
            .content('It seems you are not signed in please signin')
            .ariaLabel('Lucky day')
            .targetEvent(e)
            .ok('signin here')
            .cancel('Ignore');
        $mdDialog.show(confirm).then(function() {
            window.location = '/signin?redirect=' + location.pathname;
        }, function() {
            return;
        });
    };
    angular.module('appsDetailCtrlModule', [])
        .controller('appDetailController', [
            '$scope', '$http', '$mdDialog', 'Notification', 'http', 'model',
            function(
                $scope, $http, $mdDialog, Notification, http, model
            ) {
                var _id;
                var paths = location.pathname.split('/');
                _id = paths[3];
                model._id = _id;
                $http.get('/services/getdocument?cname=letsbuild&_id=' + _id)
                    .then(function(res) {
                        $scope.item = res.data;
                        $scope.item.likes = res.data.likes ? res.data.likes : [];
                        $scope.item.interests = $scope.item.interests || [];
                        $scope.likeClass = 'fa fa-thumbs-o-up';
                        var likesObj = $scope.item.likes || [];
                        if (typeof GLOBAL !== 'undefined' && GLOBAL.user) {
                            var uid = GLOBAL.user.uid;
                            if (uid) {
                                var index = likesObj.indexOf(uid);
                                $scope.likeClass = index === -1 ? 'fa fa-thumbs-o-up' : 'fa fa-thumbs-up';
                            }
                        }
                        model.item = $scope.item;
                    });
                $scope.updateLikes = function(e) {
                    e.preventDefault();
                    if (typeof GLOBAL !== 'undefined' && GLOBAL.user) {
                        var uid = GLOBAL.user.uid;
                        if (uid) {
                            var likesObj = $scope.item.likes ? $scope.item.likes : [];
                            var index = likesObj.indexOf(uid);
                            if (index !== -1) {
                                $scope.likeClass = 'fa fa-thumbs-o-up';
                                likesObj.splice(index, 1);
                                http.post('/services/update', {
                                        postData: {
                                            data: {
                                                likes: likesObj
                                            },
                                            cname: 'letsbuild',
                                            _id: _id
                                        }
                                    })
                                    .then(function(res) {});
                            } else {
                                $http.post('/services/push', {
                                        cname: 'letsbuild',
                                        _id: _id,
                                        data: {
                                            likes: uid
                                        }
                                    })
                                    .then(function(res) {
                                        $scope.likeClass = 'fa fa-thumbs-up';
                                        likesObj.push(uid);
                                    });
                            }
                        }
                    } else {
                        openSinginWarning($mdDialog, e);
                    }
                };
                $scope.expressInterestDetails = function(e) {
                    e.preventDefault();
                    if (typeof GLOBAL !== 'undefined' && GLOBAL.user) {
                        var parentEl = angular.element(document.body);
                        $mdDialog.show({
                            parent: parentEl,
                            targetEvent: e,
                            templateUrl: '/partials/express-interest.html',
                            controller: 'expressInterestController',
                        });
                    } else {
                        openSinginWarning($mdDialog, e);
                    }
                };
            }
        ]);
})(angular);
