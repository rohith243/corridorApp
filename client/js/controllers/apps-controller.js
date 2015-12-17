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

            $scope.keymap = {
                featured: 'Feature Apps',
                'my-proposals': 'My Proposals',
                'published-apps': 'Published Apps'
            }

            http.get( url )
            .then(function(res) {
                var keys = $stateParams.keys;
                var item;
                var index;

                model.appResponse = res;
                $scope.apps = {};
                $scope.limit = {};

                if( $stateParams.page === 'my-proposals' ) {
                    for (var key in keys) {
                        $scope.apps[keys[key]] = res; // drafts,published
                        $scope.limit[ keys[key] ] = 6;
                    }    
                } else {
                    for (var key in keys) {
                        $scope.limit[ keys[key] ] = 6;
                    }   
                    $scope.reArrangeApps();
                }
                
                for( index in res) { 
                    item = res[index];
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

                for( var len = model.appResponse.length - 1; len>=0; len-- ) {
                    if ( key === 'drafts' && !model.appResponse[len].isPublish) {
                        data.push( model.appResponse[len] );
                    }
                    else if( key === 'published' && model.appResponse[len].isPublish ){
                        data.push( model.appResponse[len] );
                    }
                }
                
                return data;    
                
            };

            $scope.getDataAllProp = function( tab ) {
                var data = [];
                if( !$scope.isInterested  ) {
                    return tab;
                } else {

                    for( var len = tab.length - 1, i=0 ; i <= len; i++ ) {
                        interests = tab[ i ].interests; 
                        for( var item in interests ) {
                            if( interests[ item ].mail === GLOBAL.user.mail ) {
                                data.push( tab[ i ] );
                                break;
                            }
                        }
                    }
                }
                return data;
            }

            $scope.searchpop = function() {
                openSearchApps();
            };
            $scope.reArrangeApps =  function( ) {
                $scope.apps = {
                    featured: [],
                    'my-proposals': [],
                    'published-apps':[]
                }
                
                /*
                * $scope.apps = {
                *     featured: [
                *         {},
                *         {},
                *         ...
                *     ],
                *     'my-proposals': [
                *         {},
                *         {},
                *         ...
                *     ],
                *     published-apps:[
                *         {},
                *         {}
                *     ]
                * }
                */
               
                for( var len = model.appResponse.length - 1; len>=0; len-- ) {

                    if (  model.appResponse[ len ].featured  ) {
                        //if the item is featured push  into $scope.apps[ 'featured' ]
                         $scope.apps[ 'featured' ].push(model.appResponse[ len ]);
                    }
                    else if( GLOBAL.user && GLOBAL.user.mail === model.appResponse[ len ].owner.mail ) {
                        // if item owner then push in to $scope.apps[ 'my-proposals' ]
                        $scope.apps[ 'my-proposals' ].push(model.appResponse[ len ]);
                    } 
                    else {
                        // else push into $scope.apps[ 'published-apps' ]
                        $scope.apps[ 'published-apps' ].push(model.appResponse[ len ]);

                    }
                    
                }
            };
        }
    ]);
    appTile.init();
})
