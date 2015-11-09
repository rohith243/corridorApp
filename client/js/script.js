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
                templateUrl: 'partials/home.html'
              }
            }
        })
        .state('propose-form', {
            url: "/propose-form",
            views: {
              "lazyLoadView": {
                templateUrl: 'partials/propose-form.html',
                controller: 'proposeFormController'
              }
            },
            resolve: { 
              loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load('js/controllers/propose-form.js');
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
    ;
    common.init();
    angular.bootstrap( document, [ 'commonModule', 'todoApp' ] )
})
