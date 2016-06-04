
controllers.controller('BrowseCtrl', function($scope, $ionicPlatform, $cordovaFile, $timeout) {

	 $scope.imageSrcs = [];
    var IMAGE_STORAGE_KEY = 'images';
    var imageStuff = [];
    var getImages = function () {
    var images = [];
      var img = window.localStorage.getItem(IMAGE_STORAGE_KEY);
      if (img) {
        images = JSON.parse(img);
      } else {
        images = [];
      }
      return images;
    };


    $scope.myWork = function(){
      $ionicPlatform.ready(function(){

        var images = getImages();

        for( var i = 0; i < images.length; i ++) {

          $cordovaFile.readAsText(cordova.file.dataDirectory, images[i])
            .then(function (success) {
              imageStuff.push(success);
              $scope.$broadcast('gifRetrieveEvent', success);
            }, function (error) {
              // error
              console.log('mywork: error');
            });
        }
      });

      var innerIndex = 0;

      $scope.$on('gifRetrieveEvent', function(event, message) {

        $timeout(function() {
          $scope.imageSrcs.push(message);
        });
      });
    }

    $scope.myWork();

})

;
