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
    if(id == 0){

      /*In fact this method could be put in video-controller class, but for trimming process, the player needs to
       know in advance the source of the video. So, here the source of the video is known and direct the page to trimming page.
       Actually, this method is moved to video controller, and after getting the source, updated the html page, but it did
       not work, there was no choice except getting the source of the video from here.
      */
      $ionicPlatform.ready(function () {

        //https://github.com/rossmartin/cordova-plugin-instagram-assets-picker
        InstagramAssetsPicker.getMedia(
            function (result) { // success cb
              console.log('getMedia success, result: ', JSON.stringify(result, null, 2));
              $scope.$apply(function () {
                $rootScope.originalVideoPath = result.filePath;
                $state.go('app.trim',{id: id});
              })
            },
            function (err) { // error cb
              console.log('getMedia error, err: ', err);
            },
            { // options
              type: 'video', // accepts 'photo', 'video', or 'all' - defaults to all
              cropAfterSelect: false, // see the note above for when this is false - defaults to false
              showGrid: true // determines whether to show the grid for cropping - defaults to false
            }
        );
      })
    }
    else{
      $state.go('app.trim',{id: id});
    }
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
