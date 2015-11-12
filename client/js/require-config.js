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
        'angular-messages': '../bower_components/angular-messages/angular-messages',
        'jsoneditor': '../bower_components/jsoneditor/dist/jsoneditor',
        'sanitize': '../bower_components/angular-sanitize/angular-sanitize.min',
        'markdown': '../bower_components/angular-markdown-directive/markdown',
        'showdown': '../bower_components/showdown/compressed/Showdown'
    },
    shim: {
        "angular": {
            exports: "angular",
            deps: ["jquery"]
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
        },
        jsoneditor: {
            exports: "JSONEditor"
        },
        'sanitize' : {
            deps: [ 'angular' ]
        }

    },
    modules: [{
        name: "mediators/common",
        include: ["modules/canvas", "vendor/angular-custom"]
    }]
};