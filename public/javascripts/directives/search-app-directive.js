
( function  ( angular ) {
    angular.module('searchAppModule', [])
    .directive('searchApp', [function() {
        return {
            templateUrl: '/partials/app-overlay.html',
            restict: 'A',
            scope: {
                isEdit: '='
            },
            controller: 'searchOverlayController'
        }
    }])
    .controller( 'searchOverlayController', [
        '$scope',
        'model',
        '$filter',
        'http',
        'Notification',
        function(
            $scope,
            model,
            $filter,
            http,
            Notification
        ) {
            
            $scope.filteredApps = function() {
                if ( $scope.searchText ) {
                    return $filter('filter')(model.appResponse && model.appResponse, $scope.searchText);
                } else {
                    return [];
                }
            };
            $scope.deleteItem = function(e, item, index, key) {
                e.preventDefault();
                if ( confirm('do you want to delete "' + item.appName + '" ?') ) {
                    http.get('/services/deletedoc?cname=letsbuild&_id=' + item._id)
                      .then(function(res) {
                          for(var i in model.appResponse ) {
                            if( item._id ===  model.appResponse[ i ]._id ) {
                                model.appResponse.splice( i, 1 );
                            }
                          } 
                          Notification.success( 'app successfully deleted' );
                      });      
                }
            };
        }
    ] );
})( angular )
