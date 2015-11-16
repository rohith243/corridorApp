require([
  'jquery',
  'angular',
  'modules/common',
  'ui-router',
  'ocLazyLoad'
], 
function(
    $,
    angular,
    common,
    router,
    ocLazyLoad
){
    var app = angular.module( 'letsBuild', [ 'ui.router', 'oc.lazyLoad' ] );  
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
              }],
              signedin: [ 'http', function(http) {
                return http.get( 'services/checksignin' ); 
              } ]
            }
        })
        .state('editItem', {
            url: '/edit/:id',
            views: {
              "lazyLoadView": {
                controller: 'proposeFormEditController',
                templateUrl: 'partials/propose-form.html'
              }
            },
            resolve: { 
              loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load('js/controllers/propose-form.js');
              }]
            }
        })
        .state('myProposals', {
            url: '/my-proposals',
            views: {
              "lazyLoadView": {
                controller: 'appsController',
                templateUrl: 'partials/my-apps.html'
              }
            },
            params: {
              url: './api/apps/myApps',
              keys: [ 'drafts' , 'published' ]
            },
            resolve: { 
              loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'js/controllers/apps-controller.js',
                  '../css/gallary/index.css'
                ]);
              }]
            }
        })
        .state('allProposals', {
            url: '/all-proposals',
            views: {
              "lazyLoadView": {
                controller: 'appsController',
                templateUrl: 'partials/all-proposals.html'
              }
            },
            params: {
              url: './api/apps/publishedApps',
              keys: [ 'publishedApps' ]
            },
            resolve: { 
              loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'js/controllers/apps-controller.js',
                  '../css/gallary/index.css'
                ]);
              }]
            }
        })
        .state('admin', {
            url: '/admin',
            views: {
              "lazyLoadView": {
                controller: 'appsController',
                templateUrl: 'partials/admin-proposals.html'
              }
            },
            params: {
              url: './api/apps/publishedApps',
              keys: [ 'publishedApps' ]
            },
            resolve: { 
              loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'js/controllers/apps-controller.js',
                  '../css/gallary/index.css'
                ]);
              }]
            }
        })
        .state('adminEdit', {
            url: '/admin/edit/:id',
            views: {
              "lazyLoadView": {
                controller: 'adminEditController',
                templateUrl: 'partials/admin-edit-app.html'
              }
            },
            resolve: { 
              loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'js/controllers/admin-edit-controller.js',
                    '../css/admin-editor/index.css'
                ]);
              }]
            }
        })
        .state('details', {
            url: '/details/:id',
            views: {
              "lazyLoadView": {
                controller: 'appDetailsController',
                templateUrl: 'partials/app-details.html'
              }
            },
            resolve: { 
              loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'js/controllers/app-details-controller.js',
                  '../css/app-details/index.css'
                ]);
              }]
            }
        })
        .state('siteConfig', {
            url: '/site-config',
            views: {
              "lazyLoadView": {
                controller: 'siteConfigController',
                templateUrl: 'partials/site-config.html'
              }
            },
            resolve: { 
              loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load('js/controllers/site-config-controller.js');
              }]
            }
        })
        .state('aboutus', {
            url: '/aboutus',
            views: {
              "lazyLoadView": {
                templateUrl: 'partials/aboutus.html'
              }
            }
        })
        .state('featureConfig', {
            url: '/feature-config',
            views: {
              "lazyLoadView": {
                controller: 'featureConfigController',
                templateUrl: 'partials/feature-config.html'
              }
            },
            resolve: { 
              loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load('js/controllers/feature-config-controller.js');
              }]
            }
        })
    })
    ;
    common.init();
    angular.bootstrap( document, [ 'commonModule', 'letsBuild' ] )
})


