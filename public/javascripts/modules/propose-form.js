(function(angular) {
    var app = angular.module('proposeForm', ['commonModule', 'markdownModule','ngMessages', 'ui.router', 'proposeFormControllers']);
    app.config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('default', {
                url: '/',
                templateUrl: basePath + 'partials/propose-form.html',
                controller: 'proposeFormController'
            })
            .state('editItem', {
                url: '/edit/:_id',
                templateUrl: basePath + 'partials/propose-form.html',
                controller: 'proposeFormEditController'
            });
    });
    angular.bootstrap(document, ['proposeForm']);
})(angular);
