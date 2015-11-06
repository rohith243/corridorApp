require([
  'angular',
  'modules/common',
  'ui-router',
  'ocLazyLoad'
], 
function(
    angular,
    common,
    router,
    ocLazyLoad
){
    var app = angular.module( 'todoApp', [ 'ui.router', 'oc.lazyLoad' ] );  
    app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('default', {
            url: "/", 
            views: {
              "lazyLoadView": {
                controller: 'allTodoController',
                templateUrl: 'partials/all-todo.html'
              }
            },
            resolve: { 
              loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load('js/controllers/all-todo.js');
              }]
            }
        })
        .state('editItem', {
            url: '/edit/:id',
            views: {
              "lazyLoadView": {
                controller: 'editTodoController',
                templateUrl: 'partials/edit-todo.html'
              }
            },
            resolve: { 
              loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load('js/controllers/edit-todo.js');
              }]
            }
        })
        .state('myTodos', {
            url: '/my-todos',
            views: {
              "lazyLoadView": {
                controller: 'myTodoController',
                templateUrl: 'partials/my-todo.html'
              }
            },
            resolve: { 
              loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load('js/controllers/my-todo.js');
              }]
            }
        });
    })
    .directive( 'globalNav', function() {
        return {
            'templateUrl': './partials/global-nav.html',
            controller: [ 
                '$scope',
                'http',
                '$state',

                function( $scope, http, $state ){
                    $scope.user = GLOBAL.user;
                    $scope.logout = function( e ) {
                      e.preventDefault();
                      http.get( './services/signout' )
                      .then( function() {
                        $scope.user = null;
                        GLOBAL.user = null;
                        $state.go( 'default' );
                      } )
                    }
                } 
            ]
        }
    } )
    ;
    common.init();
    angular.bootstrap( document, [ 'commonModule', 'todoApp' ] )
})
