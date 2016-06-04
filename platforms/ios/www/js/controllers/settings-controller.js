//angular.module('gifer.settings-controller', [])

controllers.controller('SettingsCtrl', function($rootScope,$scope, $stateParams, $ionicPopover, $cordovaPreferences, $ionicPlatform) {

  $ionicPlatform.ready (function () {
    $cordovaPreferences.fetch('isFirstTime')
      .success(function(value) {
        if (value == true) {
          $scope.cameraroll = false;
          $scope.duplicate = false;
          $scope.another = false;
          $cordovaPreferences.store('cameraroll', false);
          $cordovaPreferences.store('duplicate', false);
          $cordovaPreferences.store('another', false);
        }else if (value == false){
          $cordovaPreferences.fetch('cameraroll')
          .success(function(value){
            $scope.cameraroll = value;
          }).error(function(error){
            $scope.cameraroll = false;
          });

          $cordovaPreferences.fetch('duplicate')
          .success(function(value){
            $scope.duplicate = value;
          }).error(function(error){
            $scope.duplicate = false;
          });

          $cordovaPreferences.fetch('another')
          .success(function(value){
            $scope.another = value;
          }).error(function(error){
            $scope.another = false;
          });

        }
      })
      .error(function(error) {
      })
  })

  $scope.camerarollChange = function(){
    $cordovaPreferences.store('cameraroll', $scope.cameraroll);
  }
  $scope.duplicateChange = function(){
    $cordovaPreferences.store('duplicate', $scope.duplicate);
  }
  $scope.otherChange = function(){
    $cordovaPreferences.store('another', $scope.another);
  }

  $scope.checkColor = function(color){
    if ($scope.isColorChecked(color)) {

    } else {
      $scope.checkedColor = color;
      $rootScope.appColor = color;
    }
  }

  $scope.isColorChecked = function(color){
    return $scope.checkedColor === color;
  }

  $scope.checkColor('calm');

  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

  $scope.toggleGroup('themes');

  $scope.infoPopover = function($event, index){
    if(index == 0){
      var template = '<ion-popover-view><ion-header-bar> <h1 class="title">Info</h1> </ion-header-bar><ion-content>When this activated the gifs you have done will be saved in to cameraroll as well as in app itself</ion-content></ion-popover-view>';
      $scope.popover = $ionicPopover.fromTemplate(template, {scope: $scope});
      $scope.popover.show($event);
    } else if (index == 1) {
      var template = '<ion-popover-view><ion-header-bar> <h1 class="title">Info</h1> </ion-header-bar><ion-content>When this is activated, edited gifs will be duplicated and changes will affect only duplicated one, original one be saved.</ion-content></ion-popover-view>';
      $scope.popover = $ionicPopover.fromTemplate(template, {scope: $scope});
      $scope.popover.show($event);
    } else if (index == 2) {
      var template = '<ion-popover-view><ion-header-bar> <h1 class="title">Info</h1> </ion-header-bar><ion-content>When this is activated blah blah ...</ion-content></ion-popover-view>';
      $scope.popover = $ionicPopover.fromTemplate(template, {scope: $scope});
      $scope.popover.show($event);
    } else{

    }
  }

  $scope.$on('popover.hidden', function() {
    $scope.popover.remove();
  });

})

;
