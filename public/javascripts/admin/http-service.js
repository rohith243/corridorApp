(function(angular) {
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
                                //console.log( 'inside success' );
                                defer.resolve(response);
                            })
                            .error(function(err, status) {
                                Notification.error(GLOBAL.messages.responseError);
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
                                defer.reject(data, status);
                            });
                        return defer.promise;
                    }
                };
            }
        ]);
})(angular);
