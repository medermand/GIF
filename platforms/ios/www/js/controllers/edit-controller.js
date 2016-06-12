//angular.module('gifer.edit-controller', [])

controllers.controller('EditCtrl', function($scope, $rootScope, $ionicPlatform, $cordovaFile, $cordovaDevice, $timeout, $ionicModal, $ionicPopup, $cordovaSocialSharing, $cordovaGoogleAds, $window) {
	console.log("edit gif controller has entered");
	var files =  [];
	$scope.images = [];
	$scope.play = false;
   var sup1;
   $scope.gifSrc = "";
   var message = "You should check this gif out!";
   var link = null;
   var subject = null;
   var toArr = null;
   var ccArr = null;
   var bccArr = null;

	var getFilesystem = function() {
        var deferred = $q.defer();
        
        window.requestFileSystem(window.PERSISTENT, 1024*1024, function(filesystem) {
            deferred.resolve(filesystem);
        });
        
        return deferred.promise;
    }

    var listDir = function(path, status){
      window.resolveLocalFileSystemURL(path,
        function (fileSystem) {
          var reader = fileSystem.createReader();
          reader.readEntries(
            function (entries) {
                for (var i = 0; i < entries.length; i++) {
                    if (entries[i].isDirectory) {
                        console.log("it is directory and the url is:");
                        console.log(entries[i].nativeURL);
                        listDir(entries[i].nativeURL);
                    }else if (entries[i].isFile) {
                        console.log("file would be this :");
                        console.dir(entries[i]);
                        files.push(entries[i]);
                    }
                }

                if (status == 'final') {
                	$scope.$broadcast('fileRetrieveEventDone', 1);
                }
                console.log("entries length is this: ");
              console.log(entries.length);
              console.log("entries");
              console.dir(entries);
            },
            function (err) {
              console.log(err);
            }
          );
        }, function (err) {
          console.log(err);
        }
      );
    }
    
//example: list of www folder in cordova/ionic app

$ionicPlatform.ready(function() {
	console.log("platform ready function has entered")

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

	var platform = $cordovaDevice.getPlatform();

	if (platform == 'iOS') {
	    console.log("platform is iOS");
	    listDir(cordova.file.dataDirectory, null);
	    listDir(cordova.file.documentsDirectory, null);
	    listDir(cordova.file.syncedDataDirectory, null);
	    listDir(cordova.file.tempDirectory, 'final');
	}else if (platform == 'Android') {
	    console.log("platform is Android");
	    listDir(cordova.file.dataDirectory, null);
	    listDir(cordova.file.externalRootDirectory, 'final');
	}

});

$scope.$on('fileRetrieveEventDone', function(event, message) {
	console.log("file retrieve event done has entered");
	$timeout(function() {
		console.log("**************************************************************************************************************************************************************************************");
		console.log("files length !!!!!!!!!!!!inside!!!!!!!!! the time out function is this : " + files.length);
        for (var i = 0; i < files.length; i++) {
        	var name = files[i].name;
			console.log("**************************************************************************************************************************************************************************************");
			console.log(name);
			//name.includes(".gif", 0)
			var indexOf = name.indexOf('.gif');
			if (indexOf >= 0) {
				$scope.images.push(files[i]);
			}
		}
    }, 1000);

});

$scope.openPlayer = function(index){

      $scope.gifSrc = $scope.imageSrcs[index].nativeURL;

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
