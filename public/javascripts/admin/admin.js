var getPostData = function(data, originalData, cname) {
    var map = {
        appstore: ['name', 'category', 'src', 'srcLg', 'infotext', 'href', 'desc'],
        letsbuild: ['name', 'src', 'status', 'effort', 'percentageOfCompletion', 'category', 'href',
            'division',
            'shortDesc',
            'longDesc',
            'techDetails',
            'vedioLink',
            'minimumBid',
            'team',
            'proposedTeam'
        ],
        globals: ['name', 'type', 'value']
    };
    var obj = {};
    for (var len = map[cname].length - 1; len >= 0; len--) {
        var key = map[cname][len];
        if (data[key] !== originalData[key]) {
            obj[key] = data[key];
        }
    }
    return obj;
};
angular.module('admin', ['ngMaterial', 'ui.router', 'ngSanitize', 'btford.markdown', 'ngMessages'])
    .config(function($stateProvider, $urlRouterProvider) {
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise('/');
        //
        // Now set up the states
        $stateProvider
            .state('default', {
                url: '/',
                templateUrl: 'partials/default.html',
                controller: 'defaultController',
                data: { isPublic: true }
            })
            .state('appstore', {
                url: '/appstore',
                templateUrl: 'partials/appstore.html',
                controller: 'appstoreController'
            })
            .state('appstoreAdd', {
                url: '/appstore/add',
                templateUrl: 'partials/appstore.add.html',
                controller: 'appstoreAddController'
            })
            .state('appstoreEdit', {
                url: '/appstore/edit/:_id',
                templateUrl: 'partials/appstore.edit.html',
                controller: 'appstoreEditController'
            })
            .state('globals', {
                url: '/globals',
                templateUrl: 'partials/globals.html',
                controller: 'globalController'
            })
            .state('letsbuild', {
                url: '/letsbuild',
                templateUrl: 'partials/letsbuild.html',
                controller: 'letsbuildController'
            })
            .state('globalsEdit', {
                url: '/globals/edit/:_id',
                templateUrl: 'partials/globals.edit.html',
                controller: 'globalEditController'
            })
            .state('globalsAdd', {
                url: '/globals/add',
                templateUrl: 'partials/globals.add.html',
                controller: 'globalAddController'
            })
            .state('letsbuildEdit', {
                url: '/letsbuild/edit/:_id',
                templateUrl: 'partials/letsbuild.edit.html',
                controller: 'letsbuildEditController'
            })
            .state('letsbuildAdd', {
                url: '/letsbuild/add',
                templateUrl: 'partials/letsbuild.add.html',
                controller: 'letsbuildAddController'
            })
            .state('signin', {
                url: '/signin',
                templateUrl: 'partials/signin.html',
                controller: 'signInController',
                data: { isPublic: true }
            });
    })
    .controller('appstoreController', function($scope, http, Notification) {
        $scope.responseLoaded = false;
        http.get('services/collection?cname=appstore')
            .then(function(res) {
                $scope.responseLoaded = true;
                $scope.apps = res;
            }, function(argument) {
                $scope.responseLoaded = true;
                $scope.responseError = true;
            });
        $scope.deleteItem = function(e, item, index) {
            e.preventDefault();
            if (confirm('do you want to delete' + item.name + '?')) {
                http.get('services/deletedoc?cname=appstore&_id=' + item._id)
                    .then(function(res) {
                        $scope.apps.splice(index, 1);
                        Notification.success(GLOBAL.messages.appdeleted);
                    });
            }
        };
    })
    .controller('appstoreAddController', function($scope, http, $state, Notification) {
        $scope.addApp = function(e) {
            e.preventDefault();
            if ($scope.appstoreAddForm.$valid) {
                http.post('services/adddocument', {
                        postData: {
                            data: $scope.item,
                            cname: 'appstore'
                        }
                    })
                    .then(function(res) {
                        if (res.type === 'error') {
                            if (res.code === '_name_exists') {
                                Notification.error('name already exists please change the name of the app');
                                $scope.item.name = '';
                            }
                            return;
                        }
                        Notification.success(GLOBAL.messages.appstoreadded);
                        $state.go('appstore');
                    } );
            }
        };
    })
    .controller('appstoreEditController', function($scope, http, $state, Notification, $stateParams) {
        var originalData;
        http.get('services/getdocument?cname=appstore&_id=' + $stateParams._id)
            .then(function(res) {
                originalData = res;
                $scope.item = angular.copy(res);
                $scope.itemName = $scope.item.name;
            });
        $scope.updateApp = function(e) {
            e.preventDefault();
            http.post('services/update', {
                    postData: {
                        data: getPostData($scope.item, originalData, 'appstore'),
                        cname: 'appstore',
                        _id: $stateParams._id
                    }
                })
                .then(function(res) {
                    Notification.success(GLOBAL.messages.appstoreupdated);
                    $state.go('appstore');
                });
        };
    })
    .controller('letsbuildController', function($scope, http, Notification) {
        $scope.responseLoaded = false;
        http.get('services/collection?cname=letsbuild')
            .then(function(res) {
                $scope.responseLoaded = true;
                $scope.apps = res;
            }, function(argument) {
                $scope.responseLoaded = true;
                $scope.responseError = true;
            });
        $scope.deleteItem = function(e, item, index) {
            e.preventDefault();
            if (confirm('do you want to delete' + item.name + '?')) {
                http.get('services/deletedoc?cname=letsbuild&_id=' + item._id)
                    .then(function(res) {
                        $scope.apps.splice(index, 1);
                        Notification.success(GLOBAL.messages.appdeleted);
                    });
            }
        };
    })
    .controller('letsbuildAddController', function($scope, http, $state, Notification) {
        $scope.addApp = function(e) {
            e.preventDefault();
            if ($scope.letsbuildAddForm.$valid) {
                http.post('services/adddocument', {
                        postData: {
                            data: $scope.item,
                            cname: 'letsbuild'
                        }
                    })
                    .then(function(res) {
                        Notification.success(GLOBAL.messages.appstoreadded);
                        $state.go('letsbuild');
                    });
            }
        };
    })
    .controller('letsbuildEditController', function($scope, http, $state, Notification, $stateParams) {
        var originalData;
        http.get('services/getdocument?cname=letsbuild&_id=' + $stateParams._id)
            .then(function(res) {
                originalData = res;
                $scope.item = angular.copy(res);
                $scope.item.team = $scope.item.team || [];
                $scope.item.proposedTeam = $scope.item.proposedTeam || [];
                $scope.itemName = $scope.item.name;
            });
        $scope.updateForm = function(e) {
            e.preventDefault();
            if ($scope.letsbuildEditForm.$valid) {
                http.post('services/update', {
                        postData: {
                            data: getPostData($scope.item, originalData, 'letsbuild'),
                            cname: 'letsbuild',
                            _id: $stateParams._id
                        }
                    })
                    .then(function(res) {
                        Notification.success(GLOBAL.messages.appstoreupdated);
                    });
            }
        };
        /*var requestSent, employees;
        $scope.querySearch  = function (query) {
          if( employees ) {
            return employees;
          }
          if( requestSent ) {
            return;
          }
          requestSent = true;
          $http.get( 'data/all-employees.json' )
          .then( function  ( res ) {
            employees = res.data.employees;
          } );
        };
        $scope.teamMemberChanged = function  ( emp ) {
          if( emp ) {
            $scope.item.team.push( emp.fullName );
            $scope.item.selectedItem.fullName = '';
            $scope.item.selectedItem = null;

          }
        }*/
    })
    .controller('globalController', function($scope, http, Notification) {
        $scope.responseLoaded = false;
        http.get('services/collection?cname=globals')
            .then(function(res) {
                $scope.responseLoaded = true;
                $scope.globals = res;
            }, function(argument) {
                $scope.responseLoaded = true;
                $scope.responseError = true;
            });
        $scope.deleteItem = function(e, item, index) {
            e.preventDefault();
            if (confirm('do you want to delete' + item.name + '?')) {
                http.get('services/deletedoc?cname=globals&_id=' + item._id)
                    .then(function(res) {
                        $scope.globals.splice(index, 1);
                        Notification.success(GLOBAL.messages.globaldeleted);
                    });
            }
        };
    })
    .controller('globalAddController', function($scope, http, $state, Notification) {
        $scope.addGlobal = function(e) {
            e.preventDefault();
            if ($scope.globalAddForm.$valid) {
                http.post('services/adddocument', {
                        postData: {
                            data: $scope.item,
                            cname: 'globals'
                        }
                    })
                    .then(function(res) {
                        Notification.success(GLOBAL.messages.appstoreadded);
                        $state.go('globals');
                    });
            }
        };
    })
    .controller('globalEditController', function($scope, http, $state, Notification, $stateParams) {
        var originalData;
        http.get('services/getdocument?cname=globals&_id=' + $stateParams._id)
            .then(function(res) {
                originalData = res;
                $scope.item = angular.copy(res);
                $scope.itemName = $scope.item.name;
            });
        $scope.updateGlobal = function(e) {
            e.preventDefault();
            http.post('services/update', {
                    postData: {
                        data: getPostData($scope.item, originalData, 'globals'),
                        cname: 'globals',
                        _id: $stateParams._id
                    }
                })
                .then(function(res) {
                    Notification.success(GLOBAL.messages.appstoreupdated);
                    $state.go('globals');
                });
        };
    })
    .controller('defaultController', function($scope, http, $state, Notification, Auth) {
       console.log( 'default view' );
    })
    .controller('signInController', function($scope, http, $state, Notification, Auth) {
       $scope.login = function  ( e ) {
           
           e.preventDefault();
           
           if( $scope.signinForm.$valid ) {
                http.post( 'services/signin', {
                    postData: {
                        data: $scope.item
                    }
                } )
                .then( function  ( res ) {
                    Auth.setUser( res );
                    Notification.success( 'successfully loggedIn' );
                    $state.go( 'appstore' );
                }, function  ( res ) {
                    $scope.errorCode = res.code;
                } ); 
           }
       };
    })
    
    .run(['$rootScope', '$state', 'Auth', function ($rootScope, $state, Auth ) {
        $rootScope.$on('$stateChangeStart', function (event,toState,toParams,fromState,fromParams) {
            
            var isAuthenticated = Auth.isLoggedIn();
            var isPublic = angular.isObject(toState.data)&& toState.data.isPublic;    
            if ( isPublic || isAuthenticated ) {
              return;
            }
            event.preventDefault();
            $state.go( 'signin' );

        });
    }])
    .factory('Auth', function(){
        var user;
        
        return{            
            setUser : function(aUser){
                user = aUser;
            },
            isLoggedIn : function(){
                return(user)? user : false;
            }

        };
    });

angular.module('notification', ['ui-notification'])
    .config(function(NotificationProvider) {
        NotificationProvider.setOptions({
            delay: 3000,
            startTop: 20,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'right',
            positionY: 'top'
        });
    });
angular.bootstrap(document, ['admin', 'notification', 'httpService']);
