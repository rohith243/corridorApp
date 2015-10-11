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
                var item = model.item;
                var totalEffort = 0;
                for (var interest in item.interests) {
                    var user = item.interests[interest];
                    if (user.hours && !isNaN(user.hours)) {
                        totalEffort = totalEffort + parseInt(user.hours);
                    }                        
                }
                $scope.remainingEffort = item.effort - totalEffort;
                var interests = item.interests;
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
                    if ($scope.user.hours > $scope.remainingEffort) {
                        Notification.error('You can Enter more than remaining hours left');
                        return;
                    }
                    else {
                        http.post( '/services/expressInterest', {
                            postData: {
                                data: {
                                    hours:  $scope.user.hours,
                                    aboutme: $scope.user.aboutme
                                },
                                _id: model._id
                            }
                        } )
                        .then( function  ( res ) {
                            console.log(  res );
                            if ( isupdate ) {
                                Notification.success('Successfully updated your changes');
                            } else {
                                interests.push($scope.user);
                                Notification.success('Thanks for expressing interest');
                            }
                            
                        } );
                    }
                    

                    /*if ( isupdate ) {
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
                                },
                                key: 'expressinterest'
                            })
                            .then(function(res) {
                                if (res.status === 200) {
                                    interests.push($scope.user);
                                    Notification.success('Thanks for expressing interest');
                                }
                            });
                    }*/
                    $mdDialog.hide();
                };
            }
        ]);
})(angular);
