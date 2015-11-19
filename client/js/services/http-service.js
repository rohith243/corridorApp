define( [
    'angular',
    'config/notification-config',
], function(
    angular,
    notificationConfig
) {
    var validateLogin = function(err, $state, Notification, navMenu ) {
        if( err&& err.error === '_not_loggedin' ) {
            if( GLOBAL.user ) {
                GLOBAL.user.firstName = undefined;
                GLOBAL.user.lastName = undefined;
                GLOBAL.user.mail = undefined;
                GLOBAL.user.admin = undefined;
                GLOBAL.user = undefined;    
            }
            $state.go( 'default' );
            navMenu.openMenu( false, true);
        } else {
            Notification.error( 'Error' );
        }
    };

    return {
        init: function() {
            notificationConfig.init();
            angular.module('httpService', ['notificationConfig'])
            .factory('http', [
                '$http',
                '$q',
                'Notification',
                '$state',
                'navMenu',
                function(
                    $http,
                    $q,
                    Notification,
                    $state,
                    navMenu
                ) {
                    return {
                        get: function(url) {
                            var defer = $q.defer();
                            //console.log( 'get call' );
                            $http.get(url)
                                .success(function(response) {
                                    defer.resolve(response);
                                })
                                .error(function(err, status) {
                                    
                                    validateLogin( err, $state, Notification, navMenu );
                                    console.log( err );
                                    defer.reject(err);

                                });
                            return defer.promise;
                        },
                        post: function(url, data) {
                            var defer = $q.defer();
                            //console.log( 'post call' );
                            $http.post(url, data.postData)
                                .success(function(response, success) {
                                    defer.resolve(response, success);
                                })
                                .error(function(err, status) {
                                    validateLogin( err, $state, Notification, navMenu );
                                    defer.reject(data, status);
                                });
                            return defer.promise;
                        }
                    };
                }
            ]);
        
        }
    }
    
} );

