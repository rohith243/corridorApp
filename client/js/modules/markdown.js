define([
    'angular',
    'sanitize',
    'showdown',
    'markdown',
    'services/http-service',
    'directives/global-nav-directive'
], 
function(
    angular,
    sanitize,
    showdown,
    markdown

){
    angular.module( 'markdown', [
      'ngSanitize',
      'btford.markdown'
    ] )
    .filter('trustAsResourceUrl', ['$sce', function($sce) {
        return function(val) {
            return $sce.trustAsResourceUrl(val);
        };
    }]);

    angular.module('todoApp').requires.push( 'markdown' );

});
