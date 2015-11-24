define( [
  'angular',
  'jquery'
], 
function(
    angular,
    $
){
    var closeSearchApps = function() {
        $( document ).off('keydown.opensearch');
        $( 'body' ).removeClass('app-search-opened');
    };
    angular.module('letsBuild')
    .directive('searchApp', [function() {
        return {
            templateUrl: 'partials/app-overlay.html',
            restict: 'A',
            scope: {
                mode: '@'
            },
            controller: 'searchOverlayController',
            link: function( scope, ele ) {
                
                $( '#app-search-popup-close', ele ).click(function(e) {
                    e.preventDefault();
                    closeSearchApps();
                });
           
            }
        };
    }])
    .controller('searchOverlayController', [
        '$scope',
        'model',
        '$filter',
        'http',
        'Notification',
        '$timeout',
        function(
            $scope,
            model,
            $filter,
            http,
            Notification,
            $timeout
        ) {
            var timeoutvar;
            $scope.searchFilter = function() {
                $scope.searchResultZero = false;
                $scope.loading = true;
                $timeout.cancel( timeoutvar );
                timeoutvar = $timeout( function() {
                    $scope.loading = false;

                }, 500 );
            };

            $scope.getData = function() {
                return $filter('filter')(model.appResponse && model.appResponse, $scope.searchText);
            };
        }
    ]);
} );
