(function(angular) {
    angular.module('expressInterestModule', [])
        .controller('expressInterestController', [
            '$scope', '$mdDialog', 'Notification', 'http', 'model', '$http',
            function($scope, $mdDialog, Notification, http, model, $http) {
                var uid = GLOBAL.user.uid;
                $scope.user = {
                    mail: GLOBAL.user.mail,
                    uid: uid,
                    fullName : GLOBAL.user.firstname + ' ' + GLOBAL.user.lastname,
                    hours: '',
                    aboutme: ''
                };
                var isupdate = false;
                var interests = model.item.interests;
                if (uid && interests) {
                    for (var user in interests) {
                        if (interests[user].uid === uid) {
                            isupdate = true;
                            $scope.user = interests[user];
                            break;
                        }
                    }
                }
                $scope.closeDialog = function() {
                    $mdDialog.hide();
                };
                $scope.addContributor = function() {
                    if (isupdate) {
                        http.post('/services/update', {
                                postData: {
                                    data: {
                                        interests: interests
                                    },
                                    cname: 'letsbuild',
                                    _id: model._id
                                }
                            })
                            .then(function(res) {
                                Notification.success('Successfully updated your changes');
                            });
                    } else {
                        $http.post('/services/push', {
                                cname: 'letsbuild',
                                _id: model._id,
                                data: {
                                    interests: $scope.user
                                }
                            })
                            .then(function(res) {
                                if (res.status === 200) {
                                    interests.push($scope.user);
                                    Notification.success('Thanks for expressing interest');
                                }
                            });
                    }
                    $mdDialog.hide();
                };
            }
        ]);
})(angular);
