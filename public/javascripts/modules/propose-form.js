;
(function(angular) {
    var app = angular.module('proposeForm', ['commonModule', 'ngMessages', 'ui.router', 'proposeFormControllers'])
    app.config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('default', {
                url: '/',
                templateUrl: 'partials/propose-form.html',
                controller: 'proposeFormController'
            })
            .state('editItem', {
                url: '/edit/:_id',
                templateUrl: 'partials/propose-form.html',
                controller: 'proposeFormEditController'
            })
    });
    angular.bootstrap(document, ['proposeForm']);
})(angular);
