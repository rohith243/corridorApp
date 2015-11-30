define([
  'jquery',
  'angular',
  'directives/app-tile-directive',
  'directives/search-app-directive'
], 
function(
    $,
    angular,
    appTile,
    searchApp
){
    
    var closeSearchApps = function() {
        $(document).off('keydown.opensearch');
        $('body').removeClass('app-search-opened');
    };
    var openSearchApps = function() {
        $(document).on('keydown.opensearch', function(e) {
            if (e.keyCode === 27) {
                closeSearchApps();
            }
        });
        $('body').addClass('app-search-opened');
        setTimeout( function() {
            $('#search-app').focus();    
        }, 200 );
        
        //console.log( $('#search-app') );
    };
    angular.module( 'letsBuild' )
    .controller('appsController', [
        '$scope',
        'model',
        'Notification',
        'http',
        '$filter',
        '$timeout',
        '$stateParams',
        function(
            $scope,
            model,
            Notification,
            http,
            $filter,
            $timeout,
            $stateParams
        ) {
            var url = $stateParams.url;
            $scope.user = GLOBAL.user;
            http.get( url )
            .then(function(res) {
                var keys = $stateParams.keys;
                model.appResponse = res;
                $scope.apps = {};
                $scope.limit = {};
                for (var key in keys) {
                    $scope.apps[keys[key]] = res; // drafts,published
                    $scope.limit[ keys[key] ] = 6;
                }
                for( var index in res) { 
                    var item = res[index];
                    if (item) {
                        item.likes = item.likes || [];
                    }
                }
            });

            $scope.getData = function( key, page ) {
                var data = [];
                var interests;
                if ( !model.appResponse ) {
                    return data;
                }
                if( page === 'all' ) {
                    if( !$scope.isInterested || !GLOBAL.user ) {
                        return model.appResponse
                    } else {

                        for( var len = model.appResponse.length - 1, i=0 ; i <= len; i++ ) {
                            interests = model.appResponse[ i ].interests; 
                            for( var item in interests ) {
                                if( interests[ item ].mail === GLOBAL.user.mail ) {
                                    data.push( model.appResponse[ i ] );
                                    break;
                                }
                            }
                        }
                    }

                } else {

                    for( var len = model.appResponse.length - 1; len>=0; len-- ) {
                        if ( key === 'drafts' && !model.appResponse[len].isPublish) {
                            data.push( model.appResponse[len] );
                        }
                        else if( key === 'published' && model.appResponse[len].isPublish ){
                            data.push( model.appResponse[len] );
                        }
                    }
                }
                return data;    
                
            };
            $scope.searchpop = function() {
                openSearchApps();
            };
        }
    ]);
    appTile.init();
})
