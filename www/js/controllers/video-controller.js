//angular.module('gifer.video-controller', [])

controllers.controller('VideoCtrl', function ($rootScope, $state, $stateParams, $scope, $ionicLoading, $cordovaCapture, $ionicPlatform, makeID, customPopup, $cordovaGoogleAds, $window) {
console.log("trim state has entered so that video controller has worked!");
    var start;
    var finish;
    var isTrimChanged = false;
    var outputFilePath = "trimmedVideo-" + makeID.getNewID;
    var sup1;
    $rootScope.images = [];
    $scope.progress = 0;
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
            $scope.$apply(function () {
                console.log("supposed to retrieve the progress data");
                $scope.progress = captureProgress;
            });
        },
        sampleInterval: 20,
        numWorkers: 4
    };


    var videoRecord = function () {
        var options = {limit: 1, duration: 150};
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

        var maxVideoSize = 20;
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
            template: '<progress max="1" value="{{progress}}" class=""></progress>Creating...'
        })
        $scope.gifOptions.video = $rootScope.trimmedVideoPath;
        //{'video': $rootScope.trimmedVideoPath}
        gifshot.createGIF($scope.gifOptions , function (obj) {

            if (!obj.error) {
                console.log('video is converted to GIF');
                $scope.gifSrc = obj.image;
                //$state.go('app.video');

                console.log("there used to be the image object but that works fine so...");

                var image = document.createElement("img");
                var elem = angular.element(image);
                elem.attr('ng-src', 'img/ionic.png');
                elem.attr('rel:auto_play', 0);
                //elem.attr('rel:animated_src', $scope.gifSrc);
                elem.attr('rel:animated_src', 'img/cat.gif'); // try out this one.

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
        });
    }

})
