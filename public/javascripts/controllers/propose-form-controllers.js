(function(angular) {
    var tabcount = 4;
    var getPostData = function(data, originalData, cname) {
        var map = {
            appstore: ['name', 'category', 'src', 'srcLg', 'infotext', 'href', 'desc'],
            letsbuild: ['name', 'src', 'status', 'effort', 'percentageOfCompletion',
                'category', 'href', 'division', 'shortDesc', 'longDesc',
                'techDetails', 'vedioLink', 'minimumBid', 'team', 'proposedTeam',
                'appName', 'shortDesc', 'longDesc', 'proposedTeam', 'links',
                'solution', 'contributors', 'isPublish', 'public', 'invites',
                'imgurl'
            ],
            globals: ['name', 'type', 'value']
        };
        var obj = {};
        for (var len = map[cname].length - 1; len >= 0; len--) {
            var key = map[cname][len];
            if (data[key] !== originalData[key]) {
                obj[key] = data[key];
            }
        }
        return obj;
    };
    angular.module('proposeFormControllers', [])
        .controller('proposeFormController', [
            '$scope',
            'Notification',
            'http',
            '$state',
            '$stateParams',
            function($scope, Notification, http, $state, $stateParams) {
                $scope.item = {};
                var uid = GLOBAL.user.uid || 'defaultname';
                $scope.item.proposedTeam = [uid];
                $scope.item.contributors = [];
                $scope.item.invites = [];
                $scope.item.public = 'public';
                $scope.global = {
                    selectedIndex: 0
                };
                $scope.tabcount = tabcount;
                $scope.saveApp = function(e) {
                    e.preventDefault();
                    http.post('/services/adddocument', {
                            postData: {
                                data: $scope.item,
                                cname: 'letsbuild'
                            }
                        })
                        .then(function(res) {
                            Notification.success('successfully saved');
                            $state.go('editItem', {
                                _id: res._id
                            });
                        });
                };
                $scope.togglePublish = function(e, isPublished) {
                    e.preventDefault();
                    $scope.updateForm.$showValidation = true;
                    if ($scope.updateForm && $scope.updateForm.$valid) {
                        $scope.item.isPublish = true;
                        http.post('/services/adddocument', {
                                postData: {
                                    data: $scope.item,
                                    cname: 'letsbuild'
                                }
                            })
                            .then(function(res) {
                                Notification.success('successfully published');
                                $state.go('editItem', {
                                    _id: res._id
                                });
                            });
                    } else {
                        Notification.error('To publish fill the required fileds in other tabs');
                    }
                };
                $scope.nextTab = function(e) {
                    e.preventDefault();
                    $scope.global.selectedIndex = ($scope.global.selectedIndex + 1) % tabcount;
                };
                $scope.prevTab = function(e) {
                    e.preventDefault();
                    $scope.global.selectedIndex = ($scope.global.selectedIndex + tabcount - 1) % tabcount;
                };
            }
        ])
        .controller('proposeFormEditController', [
            '$scope',
            'Notification',
            'http',
            '$state',
            '$stateParams',
            function($scope, Notification, http, $state, $stateParams) {
                $scope.global = {
                    selectedIndex: 0
                };
                var originalData;
                var _id = $stateParams._id;
                $scope.tabcount = tabcount;
                $scope.template = 'editItem';
                if (_id) {
                    http.get('services/getdocument?cname=letsbuild&_id=' + _id)
                        .then(function(res) {
                            originalData = res;
                            $scope.item = angular.copy(res);
                            $scope.itemName = $scope.item.appName;
                            $scope.item.contributors = $scope.item.contributors || [];
                            $scope.item.proposedTeam = $scope.item.proposedTeam || [];
                            $scope.item.invites = $scope.item.invites || [];
                            $scope.isPublished = $scope.item.isPublish;
                        });
                }
                $scope.saveApp = function(e) {
                    e.preventDefault();
                    var setData = getPostData($scope.item, originalData, 'letsbuild');
                    http.post('/services/update', {
                            postData: {
                                data: setData,
                                cname: 'letsbuild',
                                _id: _id
                            }
                        })
                        .then(function(res) {
                            for (var key in setData) {
                                originalData[key] = angular.copy(setData[key]);
                                if (typeof setData.appName !== 'undefined') {
                                    $scope.itemName = setData.appName;
                                }
                            }
                            Notification.success('successfully updated');
                        });
                };
                $scope.nextTab = function(e) {
                    e.preventDefault();
                    $scope.global.selectedIndex = ($scope.global.selectedIndex + 1) % tabcount;
                };
                $scope.prevTab = function(e) {
                    e.preventDefault();
                    $scope.global.selectedIndex = ($scope.global.selectedIndex + tabcount - 1) % tabcount;
                };
                $scope.togglePublish = function(e, isPublished) {
                    e.preventDefault();
                    $scope.updateForm.$showValidation = true;
                    if (!isPublished && !$scope.updateForm.$valid) {
                        Notification.error('To publish fill the required fileds in other tabs');
                        return;
                    }
                    $scope.item.isPublish = !isPublished;
                    var setData = getPostData($scope.item, originalData, 'letsbuild');
                    http.post('/services/update', {
                            postData: {
                                data: setData,
                                cname: 'letsbuild',
                                _id: _id
                            }
                        })
                        .then(function(res) {
                            for (var key in setData) {
                                originalData[key] = angular.copy(setData[key]);
                                if (typeof setData.appName !== 'undefined') {
                                    $scope.itemName = setData.appName;
                                }
                                if (typeof setData.isPublish !== 'undefined') {
                                    $scope.isPublished = setData.isPublish;
                                }
                            }
                            if ($scope.isPublished) {
                                Notification.success('successfully published');
                            } else {
                                Notification.success('successfully unpublished');
                            }
                        });
                };
            }
        ]);
})(angular);
