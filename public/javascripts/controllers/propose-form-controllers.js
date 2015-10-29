(function(angular) {
    var tabcount = 4;
    var getPostData = function(data, originalData, cname) {
        var map = {
            appstore: ['name', 'category', 'src', 'srcLg', 'infotext', 'href', 'desc'],
            letsbuild: [
                'appName',
                'shortDesc',
                'longDesc',
                'category',
                'solution',
                'vedioLink',
                'links',
                'proposedTeam',
                'contributors',
                'public',
                'status',
                'invites',
                'interests',
                'imgurl',
                'isPublish',
                'effort'
            ],
            globals: ['name', 'type', 'value']
        };
        

        var obj = {};
        for (var len = map[cname].length - 1; len >= 0; len--) {
            var key = map[cname][len];
            if ( data[key] !== originalData[key] ) {
                obj[key] = data[key];
            }
        }
        
        return obj;
    };
    angular.module('proposeFormControllers', [])
        .controller('proposeFormController', [
            '$scope',
            'Notification',
            'http',
            '$state',
            '$stateParams',
            '$timeout',
            function($scope, Notification, http, $state, $stateParams,$timeout) {
                $scope.basePath = basePath;
                $scope.item = {};
                $scope.item.proposedTeam = [ {
                    firstName: GLOBAL.user.firstName,
                    lastName: GLOBAL.user.lastName,
                    mail: GLOBAL.user.mail
                } ];
                $scope.item.contributors = [];
                $scope.item.invites = [];
                $scope.item.public = 'public';
                $scope.global = {
                    selectedIndex: 0
                };
                $scope.tabcount = tabcount;
                $scope.$watch(
                    function() { return $scope.global.selectedIndex; },
                        function(newValue, oldValue,scope) {
                            $timeout(function() {
                                if ($(':input',$('md-tab-content')[newValue])[0]) {
                                  $(':input',$('md-tab-content')[newValue])[0].focus();
                                }
                            }, 300);
                        }
                );
                $scope.saveApp = function(e) {
                    e.preventDefault();
                    http.post( basePath + 'services/addDocument', {
                            postData: {
                                data: $scope.item,
                                cname: 'letsbuild'
                            }
                        })
                        .then(function(res) {
                            Notification.success('successfully saved');
                            $state.go('editItem', {
                                _id: res._id
                            });
                        });
                };
                $scope.togglePublish = function(e, isPublished) {
                    e.preventDefault();
                    $scope.updateForm.$showValidation = true;
                    if ($scope.updateForm && $scope.updateForm.$valid) {
                        $scope.item.isPublish = true;
                        http.post( basePath + 'services/addDocument', {
                                postData: {
                                    data: $scope.item,
                                    cname: 'letsbuild'
                                }
                            })
                            .then(function(res) {
                                Notification.success('successfully published');
                                $state.go('editItem', {
                                    _id: res._id
                                });
                            });
                    } else {
                        Notification.error('To publish fill the required fileds in other tabs');
                    }
                };
                $scope.nextTab = function(e) {
                    e.preventDefault();
                    $scope.global.selectedIndex = ($scope.global.selectedIndex + 1) % tabcount;
                };
                $scope.prevTab = function(e) {
                    e.preventDefault();
                    $scope.global.selectedIndex = ($scope.global.selectedIndex + tabcount - 1) % tabcount;
                };
                
                function loadEmployees() {
                    if( !$scope.empRequestSent ) {
                        $scope.empRequestSent = true;
                        http.get( basePath + 'confidential/phonebook.json' )
                        .then( function( res ) {
                          $scope.emps = res.employees.map( function ( obj ) {
                            var emp = {};
                            emp.firstName = obj.firstName.toLowerCase();
                            emp.lastName = obj.lastName.toLowerCase();
                            emp.mail = obj.email.toLowerCase();
                            return emp;
                          } );
                        }, function  ( err ) {
                            $scope.empRequestSent = false;
                        } );  
                    }
                    return $scope.emps || [];
                }
                var chipsugg = {};
                var findObjectIndex = function  ( arr, key, value ) {
                    
                    for( var len = arr.length -1 ;  len >= 0; len-- ) {
                        if( arr[ len ][ key ] === value ) {
                            return len;
                        }
                    }
                    return -1;
                };
                $scope.querySearch = function(query, key ) {
                    var index;
                    var len;
                    if( !chipsugg[ key ] && $scope.item[ key ] && $scope.emps ) {
                        for( len = $scope.item[ key ].length - 1; len >= 0; len-- ) {
                            index = findObjectIndex( $scope.emps, 'mail', $scope.item[ key ][ len ].mail );
                            if( index !== -1 ) {
                                $scope.item[ key ][ len ] = $scope.emps[ index ];
                            }
                        }
                        chipsugg[ key ] = true;
                    }

                    var results = query ? ( $scope.emps || loadEmployees() ).filter( createFilterFor(query) ) : [];
                    return results;
                };
                function createFilterFor(query) {
                  var lowercaseQuery = angular.lowercase(query);
                  return function filterFn( emp ) {
                    return ((emp.firstName + ' ' +  emp.lastName ).toLowerCase().indexOf(lowercaseQuery) === 0) ||
                        (emp.mail.toLowerCase().indexOf(lowercaseQuery) === 0);
                  };
                }
                
            }
        ])
        .controller('proposeFormEditController', [
            '$scope',
            'Notification',
            'http',
            '$state',
            '$stateParams',
            '$timeout',
            function($scope, Notification, http, $state, $stateParams, $timeout) {
                $scope.basePath = basePath;
                $scope.global = {
                    selectedIndex: 0
                };
                var originalData;
                var _id = $stateParams._id;
                tabcount = 6;
                $scope.tabcount = tabcount;
                $scope.template = 'editItem';
                $scope.$watch(
                    function() { return $scope.global.selectedIndex; },
                        function(newValue, oldValue,scope) {
                            $timeout(function() {
                                if ($(':input',$('md-tab-content')[newValue])[0]) {
                                  $(':input',$('md-tab-content')[newValue])[0].focus();
                                }
                            }, 300);
                        }
                );
                if (_id) {
                    http.get( basePath + 'services/getDocument?_id=' + _id)
                        .then(function(res) {
                            originalData = res;
                            $scope.item = angular.copy(res);
                            $scope.itemName = $scope.item.appName;
                            $scope.item.contributors = $scope.item.contributors || [];
                            $scope.item.proposedTeam = $scope.item.proposedTeam || [];
                            $scope.item.invites = $scope.item.invites || [];
                            $scope.isPublished = $scope.item.isPublish;
                            $scope.item.interests = $scope.item.interests || []; 
                            
                        });
                }
                $scope.saveApp = function(e) {
                    e.preventDefault();
                    var setData = getPostData($scope.item, originalData, 'letsbuild');
                    http.post( basePath + 'services/updateDoc', {
                            postData: {
                                data: setData,
                                cname: 'letsbuild',
                                _id: _id
                            }
                        })
                        .then(function(res) {
                            for (var key in setData) {
                                originalData[key] = angular.copy(setData[key]);
                                if (typeof setData.appName !== 'undefined') {
                                    $scope.itemName = setData.appName;
                                }
                            }
                            Notification.success('successfully updated');
                        });
                };
                $scope.nextTab = function(e) {
                    e.preventDefault();
                    $scope.global.selectedIndex = ($scope.global.selectedIndex + 1) % tabcount;
                };
                $scope.prevTab = function(e) {
                    e.preventDefault();
                    $scope.global.selectedIndex = ($scope.global.selectedIndex + tabcount - 1) % tabcount;
                };
                $scope.togglePublish = function(e, isPublished) {
                    e.preventDefault();
                    $scope.updateForm.$showValidation = true;
                    if (!isPublished && !$scope.updateForm.$valid) {
                        Notification.error('To publish fill the required fileds in other tabs');
                        return;
                    }
                    $scope.item.isPublish = !isPublished;
                    var setData = getPostData($scope.item, originalData, 'letsbuild');
                    http.post( basePath + 'services/updateDoc', {
                            postData: {
                                data: setData,
                                cname: 'letsbuild',
                                _id: _id
                            }
                        })
                        .then(function(res) {
                            for (var key in setData) {
                                originalData[key] = angular.copy(setData[key]);
                                if (typeof setData.appName !== 'undefined') {
                                    $scope.itemName = setData.appName;
                                }
                                if (typeof setData.isPublish !== 'undefined') {
                                    $scope.isPublished = setData.isPublish;
                                }
                            }
                            if ($scope.isPublished) {
                                Notification.success('successfully published');
                            } else {
                                Notification.success('successfully unpublished');
                            }
                        });
                };
                $scope.isContributorsAvailable = function(interestedPeople) {
                    var flag = true;
                    if (interestedPeople) {
                        for (var index in interestedPeople) {
                            if (interestedPeople[index].isContributor) {
                                flag = false;
                                break;
                            }
                        }
                    }
                    return flag;
                }
                function loadEmployees() {
                    if( !$scope.empRequestSent ) {
                        $scope.empRequestSent = true;
                        http.get( basePath + 'confidential/phonebook.json' )
                        .then( function( res ) {
                          $scope.emps = res.employees.map( function ( obj ) {
                            var emp = {};
                            emp.firstName = obj.firstName.toLowerCase();
                            emp.lastName = obj.lastName.toLowerCase();
                            emp.mail = obj.email.toLowerCase();
                            return emp;
                          } );
                        }, function  ( err ) {
                            $scope.empRequestSent = false;
                        } );  
                    }
                    return $scope.emps || [];
                }
                var chipsugg = {};
                var findObjectIndex = function  ( arr, key, value ) {
                    
                    for( var len = arr.length -1 ;  len >= 0; len-- ) {
                        if( arr[ len ][ key ] === value ) {
                            return len;
                        }
                    }
                    return -1;
                };
                $scope.querySearch = function(query, key ) {
                    var index;
                    var len;
                    if( !chipsugg[ key ] && $scope.item[ key ] && $scope.emps ) {
                        for( len = $scope.item[ key ].length - 1; len >= 0; len-- ) {
                            index = findObjectIndex( $scope.emps, 'mail', $scope.item[ key ][ len ].mail );
                            if( index !== -1 ) {
                                $scope.item[ key ][ len ] = $scope.emps[ index ];
                            }
                        }
                        chipsugg[ key ] = true;
                    }

                    var results = query ? ( $scope.emps || loadEmployees() ).filter( createFilterFor(query) ) : [];
                    return results;
                };
                function createFilterFor(query) {
                  var lowercaseQuery = angular.lowercase(query);
                  return function filterFn( emp ) {
                    return ( ( emp.firstName + ' ' +  emp.lastName ).toLowerCase().indexOf(lowercaseQuery) === 0) ||
                        (emp.mail.toLowerCase().indexOf(lowercaseQuery) === 0);
                  };
                }
                window.setTimeout(function(){
                    var shareConf = {
                        defaultMessage : 'LetsBuild idea: '+'('+$scope.item.appName+')',
                        pageUrl : location.origin+'/gallery/id/'+$scope.item._id
                    }
                    yam.platform.yammerShare(shareConf);
                    $('#yj-share-button').on("click", 'a', function(e) {
                        e.preventDefault();
                    });
                },100);
            }
        ]);
})(angular);
