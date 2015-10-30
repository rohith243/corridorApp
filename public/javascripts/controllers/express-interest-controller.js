(function(angular) {
    angular.module('expressInterestModule', [])
        .controller('expressInterestController', [
            '$scope', '$mdDialog', 'Notification', 'http', 'model', '$http',
            function($scope, $mdDialog, Notification, http, model, $http) {
                var uid = GLOBAL.user.uid;
                $scope.user = {
                    mail: GLOBAL.user.mail,
                    uid: uid,
                    firstName : GLOBAL.user.firstName,
                    lastName: GLOBAL.user.lastName,
                    hours: '',
                    aboutme: ''
                };
                var isupdate = false;
                var item = model.item;                
                var totalEffort = 0;
                var user;
                for (var interest in item.interests) {
                    user = item.interests[interest];
                    if (user.hours && !isNaN(user.hours)) {
                        totalEffort = totalEffort + parseInt(user.hours);
                    }                        
                }
                $scope.remainingEffort = item.effort - totalEffort;
                var interests = item.interests;
                if (uid && interests) {
                    for (user in interests) {
                        if (interests[user].uid === uid) {
                            isupdate = true;
                            $scope.user  = interests[user];
                            break;
                        }
                    }
                }
                $scope.closeDialog = function() {
                    $mdDialog.hide();
                };

                $scope.addContributor = function() {
                    http.post( basePath + 'services/expressInterest', {
                        postData: {
                            data: {
                                hours:  $scope.user.hours,
                                aboutme: $scope.user.aboutme
                            },
                            _id: model._id
                        }
                    } )
                    .then( function  ( res ) {
                        if ( isupdate ) {
                            Notification.success('Successfully updated your changes');
                        } else {
                            interests.push($scope.user);
                            Notification.success('Thanks for expressing interest');
                        }
                        
                    } );
                    $mdDialog.hide();
                };
            }
        ]);
})(angular);
