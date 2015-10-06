if( typeof GLOBAL === 'undefined' ) {
    GLOBAL = {};
}

var app = angular.module('signin', [ 'httpService', 'notification' ]);
app.directive('signInTile', [function() {
    return {
        templateUrl: '/partials/sign-in-tile.html',
        restict: 'A',
        scope: {
        },
        controller: 'signinCtrl'
    }
}])
.controller( 'signinCtrl', function  ( $scope, http ) {

    $scope.signinurl = '/signin?redirect=' + location.pathname;

    http.get( '/services/userdetails')
    .then(function  ( res ) {
        $scope.username = res && res.firstname && res.firstname[0];
        GLOBAL.user = res;
    }, function  ( err ) {
        console.log( err );  
    } );

    $scope.logout = function  ( e ) {
        e.preventDefault();
        http.get( '/services/logout' )
        .then( function  ( res ) {
            location = '/'
        });
    }
});
