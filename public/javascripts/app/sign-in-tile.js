if (typeof GLOBAL === 'undefined') {
    GLOBAL = {};
}
var app = angular.module('signin', ['httpService', 'notification']);
app.directive('signInTile', [function() {
        return {
            templateUrl: '/partials/sign-in-tile.html',
            restict: 'A',
            scope: {},
            controller: 'signinCtrl'
        }
    }])
    .controller('signinCtrl', function($scope, http) {
        $scope.signinurl = '/signin?redirect=' + location.pathname;
        if (typeof GLOBAL !== 'undefined' && GLOBAL.user) {
            $scope.username = GLOBAL.user.firstname;
        }
        $scope.logout = function(e) {
            e.preventDefault();
            http.get('/services/logout')
                .then(function(res) {
                    location = '/'
                });
        }
    });
