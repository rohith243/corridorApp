var tabcount = 4;
var getPostData = function(data, originalData, cname) {
    var map = {
        appstore: ['name', 'category', 'src', 'srcLg', 'infotext', 'href', 'desc'],
        letsbuild: ['name', 'src', 'status', 'effort', 'percentageOfCompletion', 'category', 'href',
            'division',
            'shortDesc',
            'longDesc',
            'techDetails',
            'vedioLink',
            'minimumBid',
            'team',
            'proposedTeam',



             'appName',
      'shortDesc',
      'longDesc',
      'proposedTeam',
      'links',
      'solution',
      'contributors',
      'isPublish',
      'public',
      'invites',
      'imgurl'
        ],
        globals: ['name', 'type', 'value']
    };
    var obj = {};
    for (var len = map[cname].length - 1; len >= 0; len--) {
        var key = map[cname][len];
        if (data[key] !== originalData[key]) {
            obj[key] = data[key];
        }
    }
    return obj;
};

var appModule = angular.module('appdetails',['ngMaterial','httpService','ngMessages', 'notification', 'ui.router']);


appModule.config(function($stateProvider, $urlRouterProvider) {
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise('/');
    //
    // Now set up the states
    $stateProvider
    .state('default', {
      url: '/',
      templateUrl: 'partials/propose-form.html',
      controller: 'proposeFormController'
    })
    .state('editItem', {
      url: '/edit/:_id',
      templateUrl: 'partials/propose-form.html',
      controller: 'proposeFormEditController'
    })
})

appModule.controller('proposeFormController', [
                     '$scope', 
                     'Notification',
                     'http',
                     '$state',
                     '$stateParams',
function( $scope, Notification, http,$state,$stateParams ) {

  $scope.item = {};
  $scope.item.proposedTeam = ['proposedusername'];
  $scope.item.contributors = ['proposedusername'];
  $scope.item.invites = ['default.email@imaginea.com'];
  $scope.item.public =  'public';
  $scope.global = {
    selectedIndex : 0
  };
  $scope.tabcount = tabcount;

  $scope.saveApp = function(e) {
      e.preventDefault();
      http.post('/services/adddocument', {
          postData: {
          data: $scope.item,
          cname: 'letsbuild'
          }
      })
      .then(function( res ) {
        Notification.success( 'successfully saved added' );
        $state.go( 'editItem', {
          _id: res._id
        } )
      });  
  };
  $scope.publishApp = function(e) {
    e.preventDefault();
    $scope.updateForm.$showValidation = true;
    
    if($scope.updateForm && $scope.updateForm.$valid) {
      $scope.item.isPublish = true;
      http.post('/services/adddocument', {
          postData: {
            data: $scope.item,
            cname: 'letsbuild'
          }
      })
      .then(function(res) {
        Notification.success( 'successfully saved added' );
        $state.go( 'editItem', {
          _id: res._id
        } )
      
      });  
    } else {
      Notification.error( 'To publish fill the required fileds in other tabs' )
    }
  };

  
  $scope.nextTab = function  ( e ) {
    e.preventDefault();
    $scope.global.selectedIndex = ( $scope.global.selectedIndex + 1 ) % tabcount;
  }


  $scope.prevTab = function  ( e ) {
    e.preventDefault();
    $scope.global.selectedIndex = ( $scope.global.selectedIndex + tabcount - 1 ) % tabcount; 
  }



}])
.controller('proposeFormEditController', [
                     '$scope', 
                     'Notification',
                     'http',
                     '$state',
                     '$stateParams',
function( $scope, Notification, http,$state,$stateParams ) {
  
  $scope.global = {
    selectedIndex : 0
  };
  var originalData;
  var _id = $stateParams._id;
  $scope.tabcount = tabcount;
  $scope.template = 'editItem';
  if( _id ) {
    http.get('services/getdocument?cname=letsbuild&_id=' + _id )
    .then( function  ( res ) {
      originalData = res;
      $scope.item = angular.copy(res);
      $scope.itemName = $scope.item.appName;
      $scope.item.contributors = $scope.item.contributors || [];
      $scope.item.proposedTeam = $scope.item.proposedTeam || [];
      $scope.item.invites = $scope.item.invites || [];
      $scope.isPublished = $scope.item.isPublish;
    } )
  }

  $scope.saveApp = function(e) {
      
      e.preventDefault();
      

      var setData = getPostData($scope.item, originalData, 'letsbuild');
      http.post('/services/update', {
          
          postData: {
              data: setData,
              cname: 'letsbuild',
              _id: _id
          }

      } )
      .then(function(res) {
        for(var key in setData) {
          originalData[ key ] = angular.copy( setData[ key ] );
          if( typeof setData.appName !== 'undefined' ) {
            $scope.itemName = setData.appName;
          }
        }

        Notification.success( 'success fully updated' );
      } );

  };

  $scope.nextTab = function  ( e ) {
    e.preventDefault();
    $scope.global.selectedIndex = ( $scope.global.selectedIndex + 1 ) % tabcount;
  }


  $scope.prevTab = function  ( e ) {
    e.preventDefault();
    $scope.global.selectedIndex = ( $scope.global.selectedIndex + tabcount - 1 ) % tabcount; 
  }

  $scope.publishApp = function( e ) {
    e.preventDefault();
    $scope.updateForm.$showValidation = true;
    $scope.item.isPublish = !$scope.item.isPublish;

    if( $scope.item.isPublish && !($scope.updateForm && $scope.updateForm.$valid) ) {
      Notification.error( 'To publish fill the required fileds in other tabs' );
      $scope.updateForm.$showValidation = true;
      return;
    }

    e.preventDefault();
      

    var setData = getPostData($scope.item, originalData, 'letsbuild');
    http.post('/services/update', {
        
        postData: {
            data: setData,
            cname: 'letsbuild',
            _id: _id
        }

    } )
    .then(function(res) {
      for(var key in setData) {
        originalData[ key ] = angular.copy( setData[ key ] );
        if( typeof setData.appName !== 'undefined' ) {
          $scope.itemName = setData.appName;
        }
        if( typeof setData.isPublish !== 'undefined' ) {
          $scope.isPublished = setData.isPublish;
        }
      }

      Notification.success( 'success fully published' );
    } );
  };




}]);