(function(angular) {
    var videoRegEx = /(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/i;

    var openSinginWarning = function($mdDialog, e) {
        var confirm = $mdDialog.confirm()
            .title('You have not signin Please sign.')
            .content('It seems you are not signed in please signin')
            .ariaLabel('Signin here')
            .targetEvent(e)
            .ok('signin here')
            .cancel('Ignore');
        $mdDialog.show(confirm).then(function() {
            window.location = '/signin?redirect=' + location.pathname;
        }, function() {
            return;
        });
    };
    angular.module('appsDetailCtrlModule', [])
        .controller('appDetailController', [
            '$scope', '$http', '$mdDialog', 'Notification', 'http', 'model',
            function(
                $scope, $http, $mdDialog, Notification, http, model
            ) {
                var _id;
                var paths = location.pathname.split('/');
                _id = paths[3];
                model._id = _id;
                $http.get('/services/getDocument?_id=' + _id)
                    .then(function(res) {
                        $scope.item = res.data;
                        $scope.item.likes = res.data.likes ? res.data.likes : [];
                        if( !( $scope.item.vedioLink && videoRegEx.test( $scope.item.vedioLink ) ) ) {
                            $scope.item.vedioLink = false;
                        }
                        $scope.item.interests = $scope.item.interests || [];
                        $scope.likeClass = 'fa fa-thumbs-up color-for-down-vote';
                        var likesObj = $scope.item.likes || [];
                        if (typeof GLOBAL !== 'undefined' && GLOBAL.user) {
                            var uid = GLOBAL.user.uid;
                            if (uid) {
                                var index = likesObj.indexOf(uid);
                                $scope.likeClass = index === -1 ? 'fa fa-thumbs-up color-for-down-vote' : 'fa fa-thumbs-up';
                            }
                        }
                        model.item = $scope.item;
                    });
                $scope.updateLikes = function(e) {
                    e.preventDefault();
                    if (typeof GLOBAL !== 'undefined' && GLOBAL.user) {
 
                            
                            http.post('/services/toggleVote', {
                                postData: {
                                    _id: _id
                                }
                            })
                            .then(function(res) {
                                var mail = GLOBAL.user.mail;
                                var likesObj = $scope.item.likes ? $scope.item.likes : [];
                                var index = likesObj.indexOf( mail );
                                if ( index !== -1 ) {
                                    $scope.likeClass = 'fa fa-thumbs-up';
                                    likesObj.splice( index, 1 );
                                } else {
                                    $scope.item.likes.push( mail );
                                    $scope.likeClass = 'fa fa-thumbs-up color-for-down-vote';
                                }
                                Notification.success( 'Updated Your changes successfully' );
                            });

                    } else {
                        openSinginWarning($mdDialog, e);
                    }
                };
                $scope.expressInterestDetails = function(e) {
                    e.preventDefault();
                    if (typeof GLOBAL !== 'undefined' && GLOBAL.user) {
                        var parentEl = angular.element(document.body);
                        $mdDialog.show({
                            parent: parentEl,
                            targetEvent: e,
                            templateUrl: '/partials/express-interest.html',
                            controller: 'expressInterestController',
                        });
                    } else {
                        openSinginWarning($mdDialog, e);
                    }
                };
            }
        ]);
})(angular);
