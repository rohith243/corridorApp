(function(angular) {
    var openSearchApps = function(argument) {
        $(document).on('keydown.opensearch', function(e) {
            if (e.keyCode === 27) {
                closeSearchApps();
            }
        });
        $('body').addClass('app-search-opened');
        $('#search-app').focus();
    };
    
    var findObjectIndex = function  ( arr, key, value ) {
        for( var len = arr.length -1 ;  len >= 0; len-- ) {
            if( arr[ len ][ key ] === value ) {
                return len;
            }
        }
        return -1;
    };
    
    var closeSearchApps = function() {
        $(document).off('keydown.opensearch');
        $('body').removeClass('app-search-opened');
        $('body').focus();
    };
    angular.module('appsControllerModule', [])
        .controller('appsController', [
            '$scope',
            'model',
            'Notification',
            'http',
            '$filter',
            '$timeout',
            function(
                $scope,
                model,
                Notification,
                http,
                $filter,
                $timeout
            ) {
                http.get(serviceConfig.app.url)
                    .then(function(res) {
                        var keys = serviceConfig.app.keys;
                        model.appResponse = res;
                        $scope.apps = {};
                        $scope.limit = {};
                        for (var key in keys) {
                            $scope.apps[keys[key]] = res; // drafts,published
                            $scope.limit[ keys[key] ] = 6;
                        }
                        
                        getFirstId = res[ 0 ]._id;
                        
                        for( var index in res) { 
                            var item = res[index];
                            if (item) {
                                item.class=$scope.bgColors()[Math.ceil(Math.random()*5)];
                                item.likes = item.likes || [];
                            }
                        }
                        

                    });
                $scope.searchpop = function(argument) {
                    openSearchApps();
                };
                $scope.deleteItem = function(e, item, index, key) {
                    e.preventDefault();
                    if (confirm('do you want to delete "' + item.appName + '" ?')) {
                        http.get('/services/deleteDoc?_id=' + item._id)
                            .then(function(res) {
                                index = findObjectIndex(model.appResponse,'_id',item._id);
                                if (index !== -1) {
                                    model.appResponse.splice(index, 1);
                                    Notification.success('app successfully deleted');
                                }
                                else {
                                    Notification.error('not able to delete contact adminstrator');
                                }
                            });
                    }
                };
                
                $scope.togglePublish = function(e, item) {
                    e.preventDefault();
                    if (item.appName && item.solution) {
                        http.post('/services/updateDoc', {
                            postData: {
                                data: {
                                    isPublish : !item.isPublish
                                },
                                _id: item._id
                            }
                        })
                        .then(function(res) {
                            item.isPublish = !item.isPublish;
                            Notification.success('successfully updated');
                        });
                    }
                    else {
                        Notification.error('Fill required details and then publish');
                    }
                };
                
                $scope.bgColors = function(){
                   return [{'background-color':'#55BDC3'},{'background-color':'#a7e1c0'},{'background-color':'#d8bce7'},{'background-color':'#eedd88'},{'background-color':'#93d5e2'},{'background-color':'#9EFF9E'}];
                };
                
                $scope.getData = function( key ) {
                    var data = [];
                    if (!model.appResponse) {
                        return data;
                    }
                    for( var len = model.appResponse.length - 1; len>=0; len-- ) {
                        if ( key === 'drafts' && !model.appResponse[len].isPublish) {
                            data.push( model.appResponse[len] );
                        }
                        else if( key === 'published' && model.appResponse[len].isPublish ){
                            data.push( model.appResponse[len] );
                        }
                    }
                    return data;
                };


            }
        ]);
})(angular);