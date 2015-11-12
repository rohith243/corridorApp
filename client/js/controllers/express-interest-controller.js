define([
  'jquery',
  'angular',
  'jsoneditor'
], 
function(
    $,
    angular,
    JSONEditor
){
    
    
    angular.module( 'todoApp' )
    .controller('expressInterestController', [
        '$scope', 
        '$mdDialog', 
        'Notification', 
        'http', 
        'model', 
        '$http',
        function($scope, $mdDialog, Notification, http, model, $http) {
            var mail = GLOBAL.user.mail;
            $scope.user = {
                mail: mail,
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
            if (mail && interests) {
                for (user in interests) {
                    if (interests[user].mail === mail) {
                        isupdate = true;
                        $scope.user.hours  = interests[user].hours;
                        $scope.user.aboutme  = interests[user].aboutme;
                        break;
                    }
                }
            }
            $scope.closeDialog = function() {
                $mdDialog.hide();
            };

            $scope.addContributor = function() {
                http.post( 'api/todos/expressInterest', {
                    postData: {
                        hours:  $scope.user.hours,
                        aboutme: $scope.user.aboutme,
                        id: model.id    
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
    
})
