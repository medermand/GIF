//angular.module('gifer.photo-controller', [])

controllers.controller('PhotoCtrl', function ($scope, $rootScope, $state, $stateParams, $window, $timeout, $cordovaImagePicker, $cordovaCapture, $cordovaFile, $ionicPlatform, $ionicModal, $ionicPopover, $ionicPopup, $ionicLoading, $ionicScrollDelegate, makeID, customPopup) {

  //**************************** variable declarations for scope *********************
  //$rootScope.images = [];
  // the reason why images variable is rootScope, is because in video editing, I am gonna set this,
  //and jump to this page. So, this is initialized in app-controller, because it is the first page that the user sees.
  $scope.isCanceled = false;
  $scope.resizedImages = [];
  $scope.selectedImages = [];
  $scope.tempImages = [];
  // filter stuff to control filter statement and merge the filter images
  //$scope.filters = ['original', 'blur', 'brightness', 'contrast', 'grayscale', 'huerotate', 'invert', 'opacity', 'saturate', 'sepia', 'shadow'];
  $scope.filters = ['original', 'aden', 'earlybird', 'rise', 'reyes', 'inkwell', 'toaster', 'walden', 'hudson', 'gingham', 'mayfair', 'lofi', 'xpro2', '_1977', 'brooklyn', 'slumber', 'nashville', 'lark', 'moon', 'clarendon', 'willow'];
  var isFiltered = false;
  var currentFilter = '';
  var filterIndex = 0;
  // tab control variables are here!
  $scope.tabNumber = 1;
  $scope.activeTab = 'pictures';

  $scope.imageLeft = 0;
  $scope.imageTop = 0;
  //default device is iphone5
  $scope.dev_width = 320;
  $scope.dev_height = 568;
  $scope.progress = 0;

  $scope.create = true;
  $scope.showBottomBar = true;
  $scope.play = true;
  $scope.isCopyButtonSelected = false;

  $scope.gifOptions = {
    gifWidth: 300,
    gifHeight: 300,
    interval: 0.1,
    numFrames: 10,
    text: '',
    fontWeight: 'normal',
    fontSize: '14px',
    minFontSize: '10px',
    resizeFont: false,
    textXCoordinate: null,
    textYCoordinate: null,
    fontFamily: 'sans-serif',
    fontColor: '#ffffff',
    'progressCallback': function (captureProgress) {
      console.log("supposed to retrieve the progress data outside the apply");
      $scope.$apply(function () {
        console.log("supposed to retrieve the progress data");
        $scope.progress = captureProgress;
      });
    },
    sampleInterval: 10,
    numWorkers: 2
  };

  var disableCropButton = true;
  var imageAllowence = 50;
  // image?
  var image;
  // super gif ebject that responsible for image player
  var sup1;
  // those variables play role in cropping
  var cropX;
  var cropY;
  var cropWidth;
  var cropHeight;
  var croppedImages = [];
  var cropper;
  var cropIndex = 0;
  // those variables are for resizing process
  var resizeIndex = 0;
  var length = $scope.tempImages.length;
  // local storage guys are here!
  var IMAGE_STORAGE_KEY = 'images';
  var localImageNames = [];

  $scope.editSheetImages = ['img/1.png', 'img/2.jpg', 'img/3.JPG', 'img/4.png'];

//**************************************** DELETE THIS *********************
//   $rootScope.images = $scope.editSheetImages;
  // $scope.tempImages = $scope.editSheetImages;
//**************************************** DELETE THIS *********************

  var repositionNewCanvas = function () {
    var top = $scope.imageTop + 'px';
    var left = $scope.imageLeft + 'px';
    var width = $scope.gifOptions.gifWidth + 'px';
    var height = $scope.gifOptions.gifHeight + 'px';
    sup1.get_canvas().id = 'preview';
    sup1.get_canvas().style.position = 'absolute';
    sup1.get_canvas().style.top = top;
    sup1.get_canvas().style.left = left;
    sup1.get_canvas().style.width = width;
    sup1.get_canvas().style.height = height;
    var elem = angular.element(document.querySelector('#preview'));
    elem.attr('ng-src', $scope.resizedImages[0]);
    elem.attr('rel:auto_play', 1);
    elem.attr('rel:animated_src', $scope.gifSrc);
    elem.addClass(currentFilter);
  }

  $scope.calculateDimensions = function (gifWidth, gifHeight) {
    $scope.dev_width = $window.innerWidth;
    $scope.dev_height = $window.innerHeight;
    //before calculate check dimensions for accuracy...
    var left = ($scope.dev_width - gifWidth) / 2;
    var top = ($scope.dev_height - gifHeight) / 2;
    $scope.imageLeft = left;
    $scope.imageTop = top;
    if (sup1 == undefined) {

    } else {
      $scope.$apply(function(){
        repositionNewCanvas();
      });
    }
  }

  $scope.calculateDimensions(350, 350);
  $scope.gifSrc = 'http://placehold.it/200x200';

  $scope.cameraOrLibraryPopup = function () {
    var cameraOrLibraryPopup = $ionicPopup.show({
      // templateUrl: 'templates/camera-photo-popup.html',
      title: 'Please select the source of gif frames',
      scope: $scope,
      buttons: [{
        text: 'Library',
        type: 'button-calm',
        onTap: function (e) {
          $scope.getImagesFromLibrary();
        }
      }, {
        text: '<b>Camera</b>',
        type: 'button-assertive',
        onTap: function (e) {
          $scope.getImagesFromCamera();
        }
      }]
    });
  }

  $scope.addMorePhotos = function () {
    $scope.create = true;
    $scope.cameraOrLibraryPopup();
  }

  $ionicPlatform.ready(function () {

    $scope.getImagesFromLibrary = function () {

      var options = {
        maximumImagesCount: imageAllowence,
        width: 0,
        height: 0,
        quality: 100
      };

      $cordovaImagePicker.getPictures(options).then(function (results) {
        // Loop through acquired images


        //although user clicks cancel button, it fires success function, so for that reason, this if condition is used
        if(results.length > 0){
          for (var i = 0; i < results.length; i++) {
            var src = results[i];
            $rootScope.images.push(src);
            $scope.tempImages.push(src);
          }
          $scope.$broadcast('getImagesDoneEvent', 1);
        }else{
          $state.go('app.menu');
        }

        //resizeAll();
        //$scope.createOrSave();
      }, function (error) {
        $ionicLoading.hide();
        console.log('Error: ' + JSON.stringify(error));    // In case of error

      });
    };

    $scope.$on('getImagesDoneEvent', function (event, message) {
      console.log("get images done event has entered!!**************************************************************");
      $scope.resizeAll();
    });

    $scope.getImagesFromCamera = function () {
      var options = {limit: imageAllowence};

      // $ionicLoading.show({
      //   template: 'Loading...'
      // });

      $cordovaCapture.captureImage(options).then(function (imageData) {
        var length = imageData.length;
        if (length > 0) {
          for (var i = 0; i < length; i++) {
            var src = imageData[i].fullPath;
            $rootScope.images.push(src);
            $scope.tempImages.push(src);
          }
          //$ionicLoading.hide();
          $scope.$broadcast('getImagesDoneEvent', 1);
        }else{
          $state.go('app.menu');
        }

      }, function (err) {
        $state.go('app.menu');

        // An error occurred. Show a message to the user
      });
    }


    //****************************************************************************
    //**************************************** UNCOMMENT THIS*********************
    if ($stateParams.id == 0) {
      $scope.getImagesFromLibrary();
    } else if ($stateParams.id == 1) {
      $scope.getImagesFromCamera();
    } else if($stateParams.id == 3) {
        for( var i = 0; i < $rootScope.images.length; i ++){
          $scope.tempImages.push($rootScope.images[i]);
        }
      $scope.$broadcast('getImagesDoneEvent', 1);
    }

    //**************************************** UNCOMMENT THIS *********************
    //*****************************************************************************


  });

  $scope.isTabActive = function (tab) {
    return $scope.activeTab === tab;
  }

  $scope.tabOne = function () {

    for (var i = 0; i < $scope.resizedImages.length; i++) {
      $scope.selectedImages[i] = false;
    }

    $scope.tabNumber = 1;
    if ($scope.isTabActive('pictures')) {
      $scope.editSheets();
    } else {
      $scope.activeTab = 'pictures';
    }
  }

  $scope.tabTwo = function () {
    $scope.tabNumber = 2;
    $scope.activeTab = 'filters';
  }

  $scope.tabThree = function () {
    $scope.tabNumber = 3;
    $scope.activeTab = 'add';
  }

  $scope.tabFour = function () {
    if (!disableCropButton) {
      $scope.tabNumber = 4;
      $scope.activeTab = 'crop';
      $ionicModal.fromTemplateUrl('templates/crop-sheet.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.cropModal = modal;
        $scope.cropModal.show().then(function () {
          crop();
        });
      });
    }
  }

  $scope.applyCssFilter = function (filter) {
    console.log("filter method has entered and selected filter = " + filter);
    if (currentFilter == '' || currentFilter == 'original') {
      var elem = angular.element(document.querySelector('#preview'));
      if (filter == 'original') {
        isFiltered = false;
      } else {
        elem.addClass(filter);
      }
      currentFilter = filter;
    } else {
      var elem = angular.element(document.querySelector('#preview'));
      elem.removeClass(currentFilter);
      if (filter == 'original') {
        isFiltered = false;
      } else {
        elem.addClass(filter);

      }
      currentFilter = filter;
    }
  }

  $scope.$on('filterAppliedEvent', function (event, message) {
    filterIndex++;
    console.log("index would be this: ");
    console.log(filterIndex);
    if (filterIndex == $scope.resizedImages.length) {
      $scope.$broadcast('filtersDoneEvent', 1);
    }
  });

  $scope.$on('filtersDoneEvent', function (event, message) {
    console.log("filters supposed to be all done by now!");
    $scope.create = false;
    isFiltered = false;
    filterIndex = 0;
    currentFilter = '';
    $scope.createOrSave();
  });

  var applyGifFilter = function () {

    console.log("entered the filter applier");
    var filterToApply = currentFilter;

    for (var i = 0; i < $scope.resizedImages.length; i++) {

      Caman('#preview', $scope.resizedImages[i], function () {
        switch (filterToApply) {
          case 'original':

            break;
          case 'aden':
            this.hue(-20).contrast(-10).saturation(-15).brightness(20);
            break;
          case 'inkwell':
            this.sepia(30).contrast(10).brightness(10).greyscale();
            break;
          case 'reyes':
            this.sepia(22).brightness(10).contrast(-15).saturation(-25);
            break;
          case 'gingham':
            this.brightness(5).hue(-10);
            break;
          case 'toaster':
            this.contrast(50).brightness(-10);
            break;
          case 'walden':
            this.brightness(10).hue(-10).sepia(30).saturation(60);
            break;
          case 'hudson':
            this.brightness(20).contrast(-10).saturation(10);
            break;
          case 'earlybird':
            this.contrast(-10).sepia(20);
            break;
          case 'mayfair':
            this.contrast(10).saturation(10);
            break;
          case 'lofi':
            this.contrast(15).saturation(10);
            break;
          case '_1977':
            this.contrast(10).saturation(30).brightness(10);
            break;
          case 'brooklyn':
            this.contrast(-10).brightness(10);
            break;
          case 'xpro2':
            this.sepia(30);
            break;
          case 'nashville':
            this.sepia(20).contrast(20).brightness(5).saturation(20);
            break;
          case 'lark':
            this.contrast(-10);
            break;
          case 'moon':
            this.greyscale().contrast(10).brightness(10);
            break;
          case 'clarendon':
            this.contrast(20).saturation(35);
            break;
          case 'willow':
            this.greyscale().contrast(-5).brightness(-10);
            break;
          case 'rise':
            this.brightness(5).sepia(20).contrast(-10).saturation(-10);
            break;
          case 'slumber':
            this.saturation(66).brightness(5);
            break;
          default:
        }
        this.render(function () {
          var base = this.toBase64();
          $scope.$broadcast('filterAppliedEvent', 1);
        });
      });
    }
  }

  var crop = function () {
    var image = document.getElementById('image');

    cropper = new Cropper(image, {
      aspectRatio: 0,
      minCropBoxWidth: 80,
      minCropBoxHeight: 80,
      checkCrossOrigin: false,
      viewMode: 1,
      crop: function (e) {
        cropX = Math.floor(e.detail.x);
        cropY = Math.floor(e.detail.y);
        cropWidth = Math.floor(e.detail.width);
        cropHeight = Math.floor(e.detail.height);
      },

    });

  }

  var getCroppedImage = function (image, index, callback_success) {
    console.log('getCroppedImage');
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');


    var dwidth = image.width;
    var dheight = image.height;

    canvas.width = dwidth;
    canvas.height = dheight;


    image.addEventListener('load', function () {
      context.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, dwidth, dheight);
      var encoded = canvas.toDataURL();
      console.log('getCroppedImage method');
      callback_success(encoded, index);
    })

  }

  var resizeImage = function (i, finalWidth, finalHeight, callback_success) {
    console.log('resize image');
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    canvas.width = finalWidth;
    canvas.height = finalHeight;

    var img = new Image();
    img.src = $scope.tempImages[i];
    img.addEventListener('load', function () {
      context.drawImage(img, 0, 0, finalWidth, finalHeight);
      callback_success(canvas.toDataURL(), i);
    })

  }

  $scope.$on('resizeAppliedEvent', function (event, message) {
    resizeIndex++;
    if (resizeIndex == length) {
      $scope.$broadcast('resizeDoneEvent', 1);
    }
  });

  $scope.$on('resizeDoneEvent', function (event, message) {
    resizeIndex = 0;
    length = 0;
    $scope.$apply(function () {
      $scope.create = true;
      $scope.resizedImages;
      $ionicLoading.hide();
      $scope.createOrSave();
      $scope.tempImages = [];
    });
    console.log('all images are resized successfully **********************************************************************');
  });

  $scope.resizeAll = function () {
    console.log("resize all function has entered and there supposed to be loading show up *******************************************");
    $ionicLoading.show({
      template: 'Loading...'
    });

    length = $scope.tempImages.length;
    for (var i = 0; i < $scope.tempImages.length; i++) {
      console.log(i);
      resizeImage(i, $scope.gifOptions.gifWidth, $scope.gifOptions.gifHeight, function (resizedImage, index) {
        console.log('resize images return');
        $scope.$apply(function () {
          $scope.resizedImages.push(resizedImage);
        });

        //console.log(resizedImage);
        $scope.$broadcast('resizeAppliedEvent', 1);
      })
    }
  }

  $scope.$on('cropAppliedEvent', function () {
    cropIndex++;
    if (cropIndex == $scope.resizedImages.length) {
      $scope.$broadcast('cropDoneEvent', 1);
    }
  });

  $scope.$on('cropDoneEvent', function () {
    $scope.cropModal.hide();
    $scope.cropModal.remove();
    $ionicLoading.hide();
    $scope.create = true;
    cropIndex = 0;
    $scope.createOrSave();
  });

  $scope.cropSheet = function () {
    $ionicLoading.show({
      template: 'Cropping the GIF...'
    });
    for (var i = 0; i < $scope.resizedImages.length; i++) {
      console.log('cropsheet');

      var image = new Image();
      console.log('cropsheet');
      image.src = $scope.resizedImages[i];

      getCroppedImage(image, i, function (success, index) {
        $scope.resizedImages[index] = success;
        console.log('crop return successful');
        //$scope.cropModal.hide();
        //console.log(success);
        $scope.$broadcast('cropAppliedEvent', 1)
      });
      //});
    }
  }

  $ionicModal.fromTemplateUrl('templates/edit-sheets.html', {
    scope: $scope
  }).then(function (modal) {
    $scope.modal = modal;
  });

  $scope.cancelEditSheets = function () {
    $scope.modal.hide();
    $scope.create = true;
    $scope.createOrSave();
  };

  $scope.editSheets = function () {
    $scope.modal.show();
  };

  $scope.moreOptionsEditSheets = function ($event) {
    $ionicPopover.fromTemplateUrl('templates/more-options-edit-sheets.html', {
      scope: $scope
    }).then(function (popover) {
      $scope.popover = popover;
    });
    $scope.popover.show($event);
  };

  $scope.applyEditSheets = function () {
    $scope.popover.hide();
    $scope.modal.hide();
  };

  $scope.resizePopup = function () {
    console.log("supposed to popup the resize part");
    var resizePopup = $ionicPopup.show({
      templateUrl: 'templates/resize-photo.html',
      scope: $scope,
      buttons: [{
        text: 'OK!',
        type: 'button-calm',
        onTap: function (e) {
          $scope.resizedImages = [];
          $scope.tempImages = $rootScope.images;
          resizeAll();
        }
      }]
    });
  }

  $scope.adjustmentsPopup = function () {
    var adjustmentsPopup = $ionicPopup.show({
      templateUrl: 'templates/adjustments-photo.html',
      scope: $scope,
      buttons: [{
        text: 'OK!',
        type: 'button-calm',
        onTap: function (e) {
          $scope.create = true;
          $scope.createOrSave();
        }
      }]
    });
  }

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

  localImageNames = getImages();

  var addImage = function (img) {
    localImageNames.push(img);
    window.localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(localImageNames));
  };

  $scope.createOrSave = function () {

    if ($scope.create) {

      $ionicLoading.show({
        scope: $scope,
        template: '<progress max="1" value="{{progress}}" class=""></progress>Loading...'
      })

      $scope.gifOptions.images = $scope.resizedImages;
      gifshot.createGIF($scope.gifOptions, function (obj) {

        if (!obj.error) {
          image = obj.image;
          $scope.$apply(function () {
            $scope.gifSrc = image;
            $scope.create = false;
            $ionicLoading.hide();
            $scope.progress = 0;
          });
          //$scope.calculateDimensions($scope.gifOptions.gifWidth, $scope.gifOptions.gifHeight);
          sup1 = new SuperGif({gif: document.getElementById('preview')});
          sup1.load();
          //$scope.$apply(function(){
          $scope.calculateDimensions($scope.gifOptions.gifWidth, $scope.gifOptions.gifHeight);
          //});
        }
      });
      disableCropButton = false;
    } else {
      //if gif has already created then this works and here the created gif gets saved...

      if (isFiltered) {

        applyGifFilter();

      } else {
        $ionicPlatform.ready(function () {

          var name = makeID.getNewID;

          console.log('create:' + "ready");

          $cordovaFile.writeFile(cordova.file.dataDirectory, name, image, true)
            .then(function (success) {

              console.log('success');
              addImage(name);

            }, function (error) {
              // error
              console.log('create:' + "error");
            });
        });
        //$state.go('app.browse',{});
      }
    }
  }

  $scope.onDropComplete = function (index, obj, evt) {
    console.log('drop success');

    //var otherObjResized = $scope.resizedImages[index];
    var otherIndexResized = $scope.resizedImages.indexOf(obj);
    var dif = otherIndexResized - index;
    var otherSelectedImage = $scope.selectedImages[otherIndexResized];
    var otherObj = $rootScope.images[index];
    var otherIndex = otherIndexResized;
    var objO = $rootScope.images[otherIndex];

    if (dif > 0) {
      for (var i = otherIndexResized; i > index; i--) {
        $scope.resizedImages[i] = $scope.resizedImages[(i - 1)];
        $rootScope.images[i] = $rootScope.images[(i - 1)];
        $scope.selectedImages[i] = $scope.selectedImages[(i - 1)];
      }
      $scope.resizedImages[index] = obj;
      $rootScope.images[index] = objO;
      $scope.selectedImages[index] = otherSelectedImage;
    } else if (dif < 0) {
      for (var i = otherIndexResized; i < index; i++) {
        $scope.resizedImages[i] = $scope.resizedImages[(i + 1)];
        $rootScope.images[i] = $rootScope.images[(i + 1)];
        $scope.selectedImages[i] = $scope.selectedImages[(i + 1)];
      }

      $scope.resizedImages[index] = obj;
      $rootScope.images[index] = objO;
      $scope.selectedImages[index] = otherSelectedImage;
    }
  }

  $scope.check = function () {
    console.log('it is dragging');
  }

  $scope.select = function (index) {
    if ($scope.isCopyButtonSelected) {
      console.log('isCopyButtonSelected is selected, so it is copying');
      for (var i = 0; i < $scope.selectedImages.length; i++) {
        if ($scope.selectedImages[i]) {
          $rootScope.images.splice(index + 1, 0, $rootScope.images[i]);
          $scope.resizedImages.splice(index + 1, 0, $scope.resizedImages[i]);
          $scope.selectedImages[i] = false;
          $scope.selectedImages.splice(index + 1, 0, false);
          index++;
        }
      }
      $scope.isCopyButtonSelected = false;

    } else {
      $scope.selectedImages[index] = !$scope.selectedImages[index];
    }
  }
  $scope.deleteSelectedItem = function () {
    for (var i = 0; i < $scope.selectedImages.length;) {
      if ($scope.selectedImages[i]) {
        $rootScope.images.splice(i, 1);
        $scope.resizedImages.splice(i, 1);
        $scope.selectedImages.splice(i, 1);
      } else {
        i++;
      }

    }

  }

  $scope.setCopyButton = function () {
    console.log('isCopyButtonSelected button is successful');
    $scope.isCopyButtonSelected = true;
  }

  $scope.openImageEditor = function (index) {

    $scope.showBottomBar = false;

    $ionicPlatform.ready(function () {

      var myImage = new Image();
      myImage.src = $scope.resizedImages[index];
      myImage.addEventListener('load', function () {
        var container = document.getElementById('editor')
        var editor = new PhotoEditorSDK.UI.ReactUI({
          container: container,
          showCloseButton: true,
          showNewButton: false,
          export: {
            showButton: true,
            type: PhotoEditorSDK.RenderType.DATAURL,
            download: false
          },
          image: myImage,
          assets: {
            baseUrl: '/assets' // <-- This should be the absolute path to your `assets` directory
          }
        });

        editor.on('close', function () {
          editor.dispose();
          $scope.$apply(function () {
            $scope.showBottomBar = true;
          });
        })

        editor.on('export', function (result, innerEditor) {

          $ionicPlatform.ready(function () {

            $scope.$apply(function () {
              $scope.resizedImages[index] = result;
              $rootScope.images[index] = result;
              $scope.create = true;

            });
            $timeout(function () {
              editor.dispose();
              $scope.showBottomBar = true;
            }, 1);
          });
        })
      })

    });

  }

  $scope.playAndPause = function () {
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
  $scope.next = function () {
    sup1.move_relative(1);
    return false;
  }
  $scope.previous = function () {
    sup1.move_relative(-1);
    return false;
  }


//############################### MEDER #################################
  $scope.scrollDisable = function () {
    // $scope.scroll = false;
    console.log('disabled');
    $ionicScrollDelegate.freezeScroll(true);

  }

  $scope.scrollEnable = function () {
    console.log('enabled');
    $ionicScrollDelegate.freezeScroll(false);
  }

//############################### MEDER #################################

})

;
