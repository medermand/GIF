//angular.module('gifer.video-controller', [])

controllers.controller('VideoCtrl', function ($rootScope, $state, $stateParams, $scope, $ionicLoading, $cordovaCapture, $ionicPlatform, makeID, customPopup, $cordovaGoogleAds, $window) {
console.log("trim state has entered so that video controller has worked!");
    var start;
    var finish;
    var isTrimChanged = false;
    var outputFilePath = "trimmedVideo-" + makeID.getNewID;
    var sup1;
    $rootScope.images = [];
    $rootScope.videoImages = [];
    $scope.progress = 0;
    var i  = 0;
    //$rootScope.trimmedVideoPath = '';
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
            console.log(i++);
            $scope.$apply(function () {
                console.log("supposed to retrieve the progress data");
                $scope.progress = captureProgress;
            });
        },
        sampleInterval: 20,
        numWorkers: 4
    };


    var videoRecord = function () {
<<<<<<< HEAD
<<<<<<< HEAD
        var options = {limit: 1, duration: }150;
=======
=======
>>>>>>> origin/master
<<<<<<< Updated upstream
        var options = {limit: 1, duration: 15};
=======
<<<<<<< HEAD
        var options = {limit: 1, duration: }150;
=======
        var options = {limit: 1, duration: 15};
>>>>>>> origin/master
>>>>>>> Stashed changes
<<<<<<< HEAD
>>>>>>> origin/master
=======
>>>>>>> origin/master
        $ionicPlatform.ready(function () {
            $cordovaCapture.captureVideo(options).then(function (videoData) {
                // Success! Video data is here
                $rootScope.trimmedVideoPath = videoData.filePath;
                $scope.trim();
            }, function (err) {
                $state.go('app.menu');
                // An error occurred. Show a message to the user
            });
        })
    }

    if ($stateParams.id == 1) {
        videoRecord();
    }

    //makeID service is only working for once, no idea why. So for using multiple times,
    // I had to write a local method.
    var makeID = function () {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;

    }

    //$scope.onTrimChange = function (strt, end) {
    //    isTrimChanged = true;
    //    start = strt;
    //    finish = end;
    //};


    $scope.trim = function (strt, end) {

        start = strt;
        finish = end;

        var maxVideoSize = 10;
        var trimmedVideoSize = finish - start;

        //if (!isTrimChanged) {
        //    trimmedVideoSize = $scope.duration;
        //}else{
        //    trimmedVideoSize = finish - start;
        //}


        console.log('trimmed video size is');
        console.log(trimmedVideoSize);

        if (trimmedVideoSize > maxVideoSize) {
            customPopup.showAlert('Error!', 'A video cannot be more than ' + maxVideoSize + 's');
        } else if(trimmedVideoSize <= maxVideoSize){
            $ionicLoading.show({
                scope: $scope,
                template: '<progress max="1" value="{{progress}}" class=""></progress>Trimming...'
            });

            VideoEditor.trim(
                trimSuccess,
                trimFail,
                {
                    fileUri: $rootScope.originalVideoPath, // path to input video
                    trimStart: start, // time to start trimming in seconds
                    trimEnd: finish, // time to end trimming in seconds
                    outputFileName: "trimmedVideo-" + makeID(), // output file name
                    progress: function (info) {
                        console.log('transcodeVideo progress callback, info: ' + info);
                        $scope.$apply(function () {
                            //console.log("supposed to retrieve the progress data");
                            $scope.progress = info/100;
                        });
                    } // optional, see docs on progress
                }
            );

            function trimSuccess(result) {
                $ionicLoading.hide();
                // result is the path to the trimmed video on the device
                $rootScope.trimmedVideoPath = result;
                console.log('trimSuccess,: ' + result);
                //$scope.$apply(function () {
                //  $rootScope.videoPath = result;
                //})
                $scope.progress = 0;
                createGIF();
            }

            function trimFail(err) {
                $ionicLoading.hide();
                $scope.progress = 0;
                console.log('trimFail, err: ' + err);
            }
        }

    }

    var createGIF = function () {
        console.log('crateGIF is called');
        $ionicLoading.show({
            scope: $scope,
            template: '<progress max="1" value="{{progress}}" class=""></progress>Creating a GIF...'
        })
        $scope.gifOptions.video = $rootScope.trimmedVideoPath;
        //{'video': $rootScope.trimmedVideoPath}


        gifshot.createGIF($scope.gifOptions , function (obj) {

            if (!obj.error) {
                console.log('video is converted to GIF');
                $scope.gifSrc = obj.image;

<<<<<<< HEAD
<<<<<<< HEAD
                // console.log( $scope.gifSrc);

                console.log('this is decodedData');
                gifshot.getVideoImages(function(images){
                    $state.go('app.photo', {id: 3, images: images});
                    $ionicLoading.hide();
                });
=======
=======
>>>>>>> origin/master
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
                // console.log( $scope.gifSrc);

                console.log('this is decodedData');
                gifshot.getVideoImages(function(images){
                    $state.go('app.photo', {id: 3, images: images});
                    $ionicLoading.hide();
                });
=======
>>>>>>> Stashed changes
                //console.log( $scope.gifSrc);

                console.log('this is decodedData');
                //save the file to a particular location.
                var fileName = makeID();

                /*there are two ways of getting images from a gif:
                1.Get frames directly from gifshot library
                2.Convert the base64 gif to other format(like download.gif) and 
                    save it to somewhere and link it to gifparser.
                */
                var decodedData = window.atob(encodedData);
                console.log(decodedData);
                saveFile(fileName, decodedData, function(){
                    console.log('the file is saved');
                    
                    var gifDirectory = cordova.file.dataDirectory + "fileName/" + decodedData;
                    parseGIF(gifDirectory);

                })
                //$state.go('app.video');

                console.log("there used to be the image object but that works fine so...");    
>>>>>>> origin/master
<<<<<<< HEAD
>>>>>>> origin/master
=======
>>>>>>> origin/master

            }
        });
    }


    var saveFile = function(fileName, file, callback_success) {
        $ionicPlatform.ready(function () {

          $cordovaFile.writeFile(cordova.file.dataDirectory, fileName, file, true)
            .then(function (success) {
                callback_success();
            }, function (error) {
              // error
            });
        });
    }


    var parseGIF = function(gifPath) {
        console.log('starting to parse the gif');
        var image = document.createElement("img");
                var elem = angular.element(image);
                elem.attr('ng-src', 'img/ionic.png');
                elem.attr('rel:auto_play', 0);
                elem.attr('rel:animated_src', gifPath);


                var option = {
                    gif: image,
                    vp_t: 0,
                    vp_l: 0,
                    vp_w: 0,
                    vp_h: 0
                }

                $rootScope.images = [];
                var frames = [];
                var frameOffsets = [];

                sup1 = new SuperGif(option);
                sup1.load(function () {
                    frames = sup1.get_frames();
                    frameOffsets = sup1.get_frameOffsets();
                    console.log('*********gif is parsed*********************************** and the length of frames is that : ****************************************' + frames.length);
                    for (var i = 0; i < frames.length; i++) {
                        var tmpCanvas = document.createElement('canvas');
                        var data = frames[i].data;
                        var x = frameOffsets[i].x;
                        var y = frameOffsets[i].y;
                        tmpCanvas.getContext("2d").putImageData(data, x, y);
                        $rootScope.images.push(tmpCanvas.toDataURL());
                    }
                    $ionicLoading.hide();
                    $scope.progress = 0;
                    console.log("!!!!!!!!!!!!!!before the state app photo called");
                    $state.go('app.photo', {id: 3, images: $rootScope.images});
                    console.log("after!!!!!!!!!!!! the state app photo called");
                });
    }

<<<<<<< HEAD
<<<<<<< HEAD


=======
=======
>>>>>>> origin/master
<<<<<<< Updated upstream
=======
<<<<<<< HEAD


=======
>>>>>>> origin/master
>>>>>>> Stashed changes
<<<<<<< HEAD
>>>>>>> origin/master
=======
>>>>>>> origin/master
})
