define([
  'angular',
  'angular-messages'
], 
function(
    angular,
    ngMessages
){
    angular.module('letsBuild').requires.push('ngMessages');
    angular.module( 'letsBuild' )    
    .controller( 'featureConfigController', [
        '$scope',
        'http',
        'Notification',
        '$mdDialog',
        'model',
        function  (
            $scope,
            http,
            Notification,
            $mdDialog,
            model
        ) {
            $scope.configs = [];
            http.get( './api/features/allFeatureConfigs' )
            .then( function( res ) {
                $scope.configs = res;
            } )

            $scope.addNewConfig = function( ev ) {
                
                $mdDialog.show({
                  controller: 'featureConfigTemplateController',
                  templateUrl:  'partials/feature-config-template.html',
                  parent: angular.element(document.body),
                  targetEvent: ev,
                  clickOutsideToClose:true
                })
                .then(function( item ) {
                    $scope.configs.push( item );
                    Notification.success( 'Addedd successfully...' );
                }, function() {
                    
                    console.log( 'then cancelled..' );

                });
            };
            
            model.isUniqueKey = function( key, id ) {

                for( var i = 0; i< $scope.configs.length ; i++ ) {
                    if( typeof id !== 'undefined' ) {
                        if( $scope.configs[ i ].featureKey === key && $scope.configs[i].id != id ) {
                            return true;
                        }    
                    } else {
                        if( $scope.configs[ i ].featureKey === key ) {
                            return true;
                        }
                    }
                    
                } 
                return false;
            };

            $scope.editFeature = function( e, index ) {
                
                e.preventDefault();
                model.featureConfig = angular.copy( $scope.configs[ index ] );
                $mdDialog.show({
                  controller: 'featureConfigTemplateController',
                  templateUrl:  'partials/feature-config-template.html',
                  parent: angular.element(document.body),
                  targetEvent: e,
                  clickOutsideToClose:true
                })
                .then(function( ) {
                    Notification.success( 'updated successfully...' );
                    $scope.configs[ index ] = model.featureConfig;
                    model.featureConfig= null;
                    
                }, function() {
                 
                    console.log( 'then cancelled..' );
                    model.featureConfig= null;

                });

            };

            $scope.deleteFeature = function( e, index ) {
                var item = $scope.configs[ index ];

                if(confirm( 'do you want to delete feature "' + item.featureKey + '" ?' ) ) {

                    http.get(  './api/feature/deleteFeatureConfig?id=' + item.id)
                    .then( function() {
                        $scope.configs.splice( index , 1 );
                        Notification.success( 'successfully Deleted' );
                    } );    
                }
                

            };
        } 
    ] )
    .controller( 'featureConfigTemplateController', [
        '$scope',
        '$mdDialog',
        'http',
        'model',
        function(
            $scope,
            $mdDialog,
            http,
            model
        ) {
            $scope.item = model.featureConfig || {
                list: [],
                open: 'none'
            };
            $scope.updateItem = model.featureConfig ? true : false; 
            $scope.closeDialog = function( e ) {
                e.preventDefault();
                $mdDialog.cancel();
            };

            $scope.updateFeatureConfig = function( e ) {
                $scope.featureConfigForm.$showValidation = true;
                
                if(  model.isUniqueKey( $scope.item.featureKey, $scope.item.id ) ) {
                    alert( 'key :"' + $scope.item.featureKey + '" is already exists Please choose another name'  )
                    return;
                } 

                if( $scope.featureConfigForm.$valid ) {
                    e.preventDefault();
                    var url = model.featureConfig ? './api/features/updateFeatureConfig' : './api/features/addFeatureConfig';
                    http.post(  url, {
                        postData: $scope.item
                    })
                    .then( function( res ) {
                        $mdDialog.hide( res || $scope.item );
                    } );    
                }
                
            };                    
        }
    ] )
            
    
})
