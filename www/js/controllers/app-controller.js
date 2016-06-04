//angular.module('gifer.app-controller', [])

controllers.controller('AppCtrl', function($scope, $rootScope, $state, $cordovaPreferences, $ionicPlatform, $ionicLoading, makeID, customPopup) {


  $rootScope.images = [];

  $scope.photo = function(id){
    console.log("photo id is equal to: " + id);
    $state.go('app.photo',{id: id});
  }

  //console.log(makeID.getNewID);
  //customPopup.showAlert('Meder','Meder kandai');

  $scope.video = function(id){
    $rootScope.originalVideoPath = '';
    console.log("video id is equal to: " + id);
    $state.go('app.trim',{id: id});
  }

  $scope.edit = function(){
    console.log("id is equal to: " + id);
    $state.go('app.edit');
  }

  $scope.browse = function(){
    $state.go('app.browse');
  }

  $scope.settings = function(){
    $state.go('app.settings');
  }

  $ionicPlatform.ready (function () {

    $cordovaPreferences.fetch('isFirstTime')
      .success(function(value) {
        if (value == null) {
          $cordovaPreferences.store('isFirstTime', true);
        }else if (value == true){
          $cordovaPreferences.store('isFirstTime', false);
        }
      })
      .error(function(error) {
      })
  })

});
