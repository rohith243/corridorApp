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
            window.location = basePath + 'signin?redirect=' + location.pathname;
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
                _id = paths[ paths.length - 1 ];
                model._id = _id;
                
                $scope.currentUser = GLOBAL.user;
                $http.get( basePath + 'services/getDocument?_id=' + _id)
                    .then(function(res) {
                        $scope.item = res.data;
                        $scope.item.likes = res.data.likes ? res.data.likes : [];
                        if( !( $scope.item.vedioLink && videoRegEx.test( $scope.item.vedioLink ) ) ) {
                            $scope.item.vedioLink = false;
                        }
                        $scope.item.interests = $scope.item.interests || [];
                        $scope.likeClass = 'upvote-container-down';
                        var likesObj = $scope.item.likes || [];
                        if (typeof GLOBAL !== 'undefined' && GLOBAL.user) {
                            var uid = GLOBAL.user.uid;
                            if (uid) {
                                var index = likesObj.indexOf(uid);
                                $scope.likeClass = index === -1 ? 'upvote-container-down' : 'upvote-container';
                            }
                        }
                        model.item = $scope.item;
                        window.setTimeout(function(){
                            var shareConf = {
                                defaultMessage : 'LetsBuild idea: '+'('+$scope.item.appName+')',
                                classSelector : 'yammer-share'
                            }
                            yam.platform.yammerShare(shareConf);
                            $('#yj-share-button a').on("click",function(e) {
                                e.preventDefault();
                            });
                        },100);
                    });
                $scope.updateLikes = function(e) {
                    e.preventDefault();
                    if (typeof GLOBAL !== 'undefined' && GLOBAL.user) {
 
                            
                            http.post( basePath + 'services/toggleVote', {
                                postData: {
                                    _id: _id
                                }
                            })
                            .then(function(res) {
                                var mail = GLOBAL.user.mail;
                                var likesObj = $scope.item.likes ? $scope.item.likes : [];
                                var index = likesObj.indexOf( mail );
                                if ( index !== -1 ) {
                                    $scope.likeClass = 'upvote-container';
                                    likesObj.splice( index, 1 );
                                } else {
                                    $scope.item.likes.push( mail );
                                    $scope.likeClass = 'upvote-container-down';
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
                            templateUrl: basePath + 'partials/express-interest.html',
                            controller: 'expressInterestController',
                        });
                    } else {
                        openSinginWarning($mdDialog, e);
                    }
                };
                $scope.isContributorsAvailable = function(interestedPeople) {
                    var flag = false;
                    if (interestedPeople) {
                        for (var index in interestedPeople) {
                            if (interestedPeople[index].isContributor) {
                                flag = true;
                                break;
                            }
                        }
                    }
                    return flag;
                };

                $scope.isEditExpress = function() {
                    if( !$scope.currentUser ) {
                        return false
                    } 
                    var interests = $scope.item.interests;
                    for ( var user in interests ) {
                        if (interests[user].mail === $scope.currentUser.mail) {
                            return true;
                        }
                    }
                };

                $scope.unExpressInterest = function( e ) {
                    
                    e.preventDefault();
                    if( confirm( 'Do you want to unexpress?' ) ) {
                        http.get( basePath + 'services/unExpressInterest?_id=' + _id )
                        .then( function( res ) {
                            Notification.success( 'successfully Removed' );
                            $scope.item.interests = res.interests;
                        } )    
                    }
                    
                }
            }
        ]);
})(angular);