var globalExcludes = [],
require = {
    baseUrl: "./js",
    waitSeconds: 90,
    paths: {
        jquery: "../bower_components/jquery/dist/jquery.min",
        angular: "../bower_components/angular/angular.min",
        'angular-animate': '../bower_components/angular-animate/angular-animate',
        'angular-aria': '../bower_components/angular-aria/angular-aria.min',
        'angular-material': '../bower_components/angular-material/angular-material.min',
        'angular-notification': '../bower_components/angular-ui-notification/dist/angular-ui-notification.min',
        'ui-router':'../bower_components/angular-ui-router/release/angular-ui-router.min',
        'ocLazyLoad': '../bower_components/oclazyload/dist/ocLazyLoad.require.min',
        'angular-messages': '../bower_components/angular-messages/angular-messages'
    },
    shim: {
        "angular": {
            exports: "angular"
        },
        "angular-animate": {
            deps: ["angular"]
        },
        "angular-aria": {
            deps: ["angular"]
        },
        "angular-material": {
            deps: ["angular", 'angular-aria', 'angular-animate']
        },
        'ui-router' : {
            deps: ["angular"]
        },
        'angular-notification' : {
            deps: ["angular"]
        },
        'angular-messages' : {
            deps: ["angular"]
        },
        'ocLazyLoad' : {
            deps: ["angular"]
        }

    },
    modules: [{
        name: "mediators/common",
        include: ["modules/canvas", "vendor/angular-custom"]
    }]
};