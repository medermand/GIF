
controllers.controller('BrowseCtrl', function($scope, $rootScope, $ionicPlatform, $cordovaFile, $timeout, $ionicModal, $ionicPopup, $cordovaSocialSharing, $cordovaGoogleAds, $window) {

   $scope.imageSrcs = [];
   $scope.play = false;
   var sup1;
   $scope.gifSrc = "";
   var message = "You should check this gif out!";
   var link = null;
   var subject = null;
   var toArr = null;
   var ccArr = null;
   var bccArr = null;

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

        try {
            console.log('Show Banner Ad');       
            $cordovaGoogleAds.createBanner({
                adId: $rootScope.adMobId.admob_banner_key,
                position: $rootScope.adMobPosition.BOTTOM_CENTER,
                isTesting: true,
                autoShow: true
            });
        } catch (e) {
            alert(e);
        }

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

    $scope.openPlayer = function(index){

      $scope.gifSrc = $scope.imageSrcs[index];

      $ionicModal.fromTemplateUrl('templates/browse-player.html', {
          scope: $scope
        }).then(function (modal) {
          $scope.playerModal = modal;
          $scope.playerModal.show().then(function(){
            sup1 = new SuperGif({gif: document.getElementById('player')});
            sup1.load();
          });
        });
    }

    $scope.closePlayer = function(){
      $scope.playerModal.hide();
      $scope.playerModal.remove();
    }

    $scope.shareTwitter = function(){
      $cordovaSocialSharing
          .shareViaTwitter(message, $scope.gifSrc, link)
          .then(function(result) {
            console.log("share via twitter is done!");
            // Success!
          }, function(err) {
            //ionicToast.show('An error occurred please try again later!', 'bottom', true, 3000);
            console.log('An error occurred in twitter share service please try again later!');
          });
      // $cordovaSocialSharing
      // .canShareVia('twitter', message, 'img/ionic.png', link)
      // .then(function(result) {
      //       $cordovaSocialSharing
      //     .shareViaTwitter(message, $scope.gifSrc, link)
      //     .then(function(result) {
      //       // Success!
      //     }, function(err) {
      //       //ionicToast.show('An error occurred please try again later!', 'bottom', true, 3000);
      //       console.log('An error occurred in twitter share service please try again later!');
      //     });
      // }, function(err) {
      //   //ionicToast.show('Share service with Twitter is not available now!', 'bottom', true, 3000);
      //   console.log('Share service with Twitter is not available now!');
      // });
    }

    $scope.shareFaceBook = function(){
      $cordovaSocialSharing
          .shareViaFacebook(message, $scope.gifSrc, link)
          .then(function(result) {
            console.log("share via facebook is ok!");
            // Success!
          }, function(err) {
            console.log("An error occured in facebook share service!");
            //ionicToast.show('An error occurred please try again later!', 'bottom', true, 3000);
          });
      // $cordovaSocialSharing
      // .canShareVia('facebook', message, $scope.gifSrc, link)
      // .then(function(result) {
      //   // Success!
      //     $cordovaSocialSharing
      //     .shareViaFacebook(message, $scope.gifSrc, link)
      //     .then(function(result) {
      //       // Success!
      //     }, function(err) {
      //       //ionicToast.show('An error occurred please try again later!', 'bottom', true, 3000);
      //     });
      // }, function(err) {
      //   //ionicToast.show('Share service with FaceBook is not available now!', 'bottom', true, 3000);
      // });
    }

    $scope.shareWhatsApp = function(){
      $cordovaSocialSharing
          .shareViaWhatsApp(message, $scope.gifSrc, link)
          .then(function(result) {
            console.log("share via whatsapp is ok'");
            // Success!
          }, function(err) {
            console.log("an error occured in whatsapp share service!");
            //ionicToast.show('An error occurred please try again later!', 'bottom', true, 3000);
          });
    }

    $scope.shareInstagram = function(){
      console.log("share via instagram has entered!");
      $cordovaSocialSharing
          .shareViaInstagram(message, $scope.gifSrc)
          .then(function(result) {
            console.log("share via instagram is ok!");
            // Success!
          }, function(err) {
            console.log("an error occured in instagram share service");
            //ionicToast.show('An error occurred please try again later!', 'bottom', true, 3000);
          });
    }

    $scope.shareEmail = function(){
      $cordovaSocialSharing
      .canShareViaEmail()
      .then(function(result) {
        // Yes we can
          $cordovaSocialSharing
          .shareViaEmail(message, subject, toArr, ccArr, bccArr, $scope.gifSrc)
          .then(function(result) {
            // Success!
          }, function(err) {
            //ionicToast.show('An error occurred please try again later!', 'bottom', true, 3000);
          });
      }, function(err) {
        //ionicToast.show('Share service with email is not available now!', 'bottom', true, 3000);
      });
    }

    $scope.shareOther = function(){
      $cordovaSocialSharing
      .share(message, subject, $scope.gifSrc, link) // Share via native share sheet
      .then(function(result) {
        // Success!
      }, function(err) {
        //ionicToast.show('Share service is not available now!', 'bottom', true, 3000);
      });
    }

    $scope.replay = function(){
      sup1.move_to(0);
      return false;
    }

    $scope.previous = function(){
      sup1.move_relative(-1);
      return false;
    }

    $scope.playAndPause = function(){
      if (!$scope.play) {
        sup1.play();
        $scope.play = true;
        return false;
      } else {
        sup1.pause();
        $scope.play = false;
        return false;
      }
    }

    $scope.next = function(){
      sup1.move_relative(1);
      return false;
    }
})

;
