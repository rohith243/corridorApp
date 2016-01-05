define([
  'angular',
  'angular-messages',
  'jquery'
], 
function(
    angular,
    ngMessages,
    $
){
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
    var findObjectIndex = function  ( arr, key, value ) {
        for( var len = arr.length -1 ;  len >= 0; len-- ) {
            if( arr[ len ][ key ] === value ) {
                return len;
            }
        }
        return -1;
    };
    var common = {
        nextPrevTab: function( $scope ) {
            $scope.nextTab = function( e ) {
                e.preventDefault();
                $scope.global.selectedIndex = ($scope.global.selectedIndex + 1) % tabcount;
            };
            $scope.prevTab = function(e) {
                e.preventDefault();
                $scope.global.selectedIndex = ($scope.global.selectedIndex + tabcount - 1) % tabcount;
            }
        },
        
        watchIndex: function( $scope ) { 
            $scope.$watch(
                function() { return $scope.global.selectedIndex; },
                function(newValue, oldValue,scope) {
                    setTimeout( function() {
                        if ($(':input',$('md-tab-content')[newValue])[0]) {
                          $(':input',$('md-tab-content')[newValue])[0].focus();
                        }
                    }, 300);
                }
            );
    
        },
        querySearch: function( $scope, http ) {
            var chipsugg = {};
            function loadEmployees() {
                if( !$scope.empRequestSent ) {
                    $scope.empRequestSent = true;
                    http.get(  './confidential/phonebook.json' )
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
            
            function createFilterFor(query) {
              var lowercaseQuery = angular.lowercase(query);
              return function filterFn( emp ) {
                return ((emp.firstName + ' ' +  emp.lastName ).toLowerCase().indexOf(lowercaseQuery) === 0) ||
                    (emp.mail.toLowerCase().indexOf(lowercaseQuery) === 0);
              };
            }
            return function( query, key ) {
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
        }
    }
    angular.module('letsBuild').requires.push('ngMessages');
    
    angular.module('letsBuild')
    .controller('proposeFormController', [
            '$scope',
            'Notification',
            'http',
            '$state',
            '$stateParams',
            '$timeout',
            'model',
            function($scope, Notification, http, $state, $stateParams,$timeout, model) {
                model.pageTitle = 'propose form';
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

                
                $scope.saveApp = function(e) {
                    e.preventDefault();
                    http.post('./api/apps/createApp', {
                            postData: $scope.item
                        })
                        .then(function(res) {
                            Notification.success('successfully saved');
                            $state.go('editItem', {
                                id: res.id
                            });
                        });
                };
                
                $scope.togglePublish = function(e, isPublished) {
                    e.preventDefault();
                    $scope.updateForm.$showValidation = true;
                    if ($scope.updateForm && $scope.updateForm.$valid) {
                        $scope.item.isPublish = true;
                        http.post( './api/apps/createApp', {
                                postData: $scope.item
                            })
                            .then(function(res) {
                                Notification.success('successfully published');
                                $state.go('editItem', {
                                    id: res.id
                                });
                            });
                    } else {
                        Notification.error('To publish fill the required fileds in other tabs');
                    }
                };

                common.nextPrevTab( $scope );
                
                $scope.querySearch = common.querySearch( $scope, http );
                common.watchIndex( $scope );
                $scope.pickImage = function( e ) {
                    e.preventDefault();
                    $( '#fileInput' ).click();
                };
                $scope.fileNameChanged = function( e ) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $scope.item.imgurl = e.target.result;
                        $scope.$apply();
                    };
                    var self = e.target;
                    reader.readAsDataURL( self.files[0] );
                };
            }
        ])
        .controller('proposeFormEditController', [
            '$scope',
            'Notification',
            'http',
            '$state',
            '$stateParams',
            '$timeout',
            'model',
            function($scope, Notification, http, $state, $stateParams, $timeout, model) {
                model.pageTitle = 'Edit App';
                $scope.global = {
                    selectedIndex: 0
                };
                var originalData;
                var id = $stateParams.id;
                tabcount = 6;
                $scope.tabcount = tabcount;
                $scope.template = 'editItem';
                if ( id ) {
                    http.get( './api/apps/getApp?id=' + id)
                        .then(function(res) {

                            if( !res || !GLOBAL.user || res.owner.mail !== GLOBAL.user.mail ) {
                                // redirect back to default if user is not owner
                                $state.go( 'default' );
                            }
                            originalData = res;
                            $scope.item = angular.copy(res);
                            $scope.itemName = $scope.item.appName ;
                            $scope.item.contributors = $scope.item.contributors || [];
                            $scope.item.proposedTeam = $scope.item.proposedTeam || [];
                            $scope.item.invites = $scope.item.invites || [];
                            $scope.isPublished = $scope.item.isPublish;
                            $scope.item.interests = $scope.item.interests || [];
                            $scope.shareConfig = {
                                defaultMessage: 'Let\'s Build : ' + $scope.itemName,
                                pageUrl: location.origin + location.pathname + '#/details/' + $scope.item.id
                            }
                            
                            
                        });
                }
                $scope.saveApp = function(e) {
                    e.preventDefault();
                    var setData = getPostData($scope.item, originalData, 'letsbuild');
                    setData.id = id;
                    http.post(  './api/apps/updateApp', {
                        postData: setData
                    })
                    .then(function(res) {

                        $scope.item = res;
                        $scope.itemName = res.appName;
                        Notification.success('successfully updated');
                    
                    });
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
                    setData.id = id;
                    http.post(  './api/apps/updateApp', {
                        postData: setData
                    })
                    .then(function(res) {
                        $scope.item = res;
                        $scope.itemName = res.appName;
                        $scope.shareConfig.defaultMessage = 'LetsBuild : ' + $scope.itemName;
                        $scope.isPublished = res.isPublish;
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
                $scope.querySearch = common.querySearch( $scope, http );
                common.watchIndex( $scope );
                common.nextPrevTab( $scope );
                $scope.isContributorsAvailable = function( interestedPeople ) {
                    if ( interestedPeople ) {
                        for (var index in interestedPeople ) {
                            if ( interestedPeople[index].isContributor ) {
                                return true;
                            }
                        }
                    }
                };

                $scope.pickImage = function( e ) {
                    e.preventDefault();
                    $( '#fileInput' ).click();
                };
                $scope.fileNameChanged = function( e ) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $scope.item.imgurl = e.target.result;
                        $scope.$apply();
                    };
                    var self = e.target;
                    reader.readAsDataURL( self.files[0] );
                };

                
                
                /* window.setTimeout(function(){
                    var shareConf = {
                        defaultMessage : 'LetsBuild idea: '+'('+$scope.item.appName+')',
                        pageUrl : location.origin+'/gallery/id/'+$scope.item.id
                    }
                    yam.platform.yammerShare(shareConf);
                    $('#yj-share-button').on("click", 'a', function(e) {
                        e.preventDefault();
                    });
                },100); */
            }
        ])
        .directive('imageonload', function() {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    element.bind('load', function() {
                        if( scope.item.imgurl.startsWith( 'data' ) ){
                            return;
                        }
                        var img = new Image();
                        img.setAttribute('crossOrigin', 'anonymous');
                        var canvas = document.createElement('CANVAS');
                        var ctx = canvas.getContext('2d');
                        var dataURL;
                        canvas.height = this.height;
                        canvas.width = this.width;
                        ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
                        dataURL = canvas.toDataURL();
                        canvas = null; 
                        scope.item.imgurl = dataURL ;    
                    });
                }
            };
        });
})
