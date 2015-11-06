define( [
    'angular',
    'config/notification-config',
], function(
    angular,
    notificationConfig
) {
    return {
        init: function() {
            notificationConfig.init();
            angular.module('httpService', ['notificationConfig'])
            .factory('http', [
                '$http',
                '$q',
                'Notification',
                function(
                    $http,
                    $q,
                    Notification
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
                                    Notification.error( 'Error' );
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
                                .error(function(data, status) {
                                    Notification.error( 'Error in Request' );
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

