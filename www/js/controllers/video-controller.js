//angular.module('gifer.video-controller', [])

controllers.controller('VideoCtrl', function ($rootScope, $state, $stateParams, $scope, $ionicLoading, $cordovaCapture, $ionicPlatform, makeID, customPopup) {

    var start;
    var finish;
    var sup1;
    $scope.gifOptions = {
        gifWidth: 200,
        gifHeight: 200,
        interval: 0.1,
        numFrames: 10,
        text: '',
        fontWeight: 'normal',
        fontSize: '16px',
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


    var videoRecord = function () {
        var options = {limit: 1, duration: 15};
        $ionicPlatform.ready(function () {
            $cordovaCapture.captureVideo(options).then(function (videoData) {
                // Success! Video data is here
            }, function (err) {
                $state.go('app.menu');
                // An error occurred. Show a message to the user
            });
        })
    }

    if ($stateParams.id == 1) {
        videoRecord();
    }

    var videoTrancode = function (filePath, success_callback) {
        var VideoEditorOptions = {
            OptimizeForNetworkUse: {
                NO: 0,
                YES: 1
            },
            OutputFileType: {
                M4V: 0,
                MPEG4: 1,
                M4A: 2,
                QUICK_TIME: 3
            }
        };

        $ionicLoading.show({
            template: 'Transcoding the video...'
        });

        VideoEditor.transcodeVideo(
            videoTranscodeSuccess, // success cb
            videoTranscodeError, // error cb
            {
                fileUri: filePath, // the path to the video on the device
                outputFileName: 'videoTranscoded-' + makeID.getNewID, // the file name for the transcoded video
                outputFileType: VideoEditorOptions.OutputFileType.MPEG4,
                optimizeForNetworkUse: VideoEditorOptions.OptimizeForNetworkUse.YES,
                saveToLibrary: false, // optional, defaults to true
                deleteInputFile: false, // optional (android only), defaults to false
                maintainAspectRatio: true, // optional, defaults to true
                width: 300, // optional, see note below on width and height
                height: 300,
                videoBitrate: 400000, // optional, bitrate in bits, defaults to 1 megabit (1000000)
                fps: 20, // optional (android only), defaults to 24
                audioChannels: 2, // optional, number of audio channels, defaults to 2
                audioSampleRate: 44100, // optional, sample rate for the audio, defaults to 44100
                audioBitrate: 128000, // optional, audio bitrate for the video in bits, defaults to 128 kilobits (128000)
                progress: function (info) {
                } // optional, see docs on progress
            }
        );


        function videoTranscodeSuccess(result) {
            // result is the path to the transcoded video on the device
            $ionicLoading.hide();
            success_callback(result);
            console.log('videoTranscodeSuccess, result: ' + result);
        }

        function videoTranscodeError(err) {
            $ionicLoading.hide();
            customPopup.showAlert('Error!', 'Cannot convert video into suitable format');
            console.log('videoTranscodeError, err: ' + err);
        }
    }

    $scope.onTrimChange = function (strt, end) {
        start = strt;
        finish = end;
    };


    $scope.trim = function () {
        $ionicLoading.show({
            template: 'Trimming the video...'
        });

        VideoEditor.trim(
            trimSuccess,
            trimFail,
            {
                fileUri: $rootScope.originalVideoPath, // path to input video
                trimStart: start, // time to start trimming in seconds
                trimEnd: finish, // time to end trimming in seconds
                outputFileName: "trimmedVideo-" + makeID.getNewID, // output file name
                progress: function (info) {
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
            createGIF();
        }

        function trimFail(err) {
            $ionicLoading.hide();
            console.log('trimFail, err: ' + err);
        }
    }

    var createGIF = function () {
        console.log('crateGIF is called');
        $ionicLoading.show({
            template: 'Converting to GIF...'
        })
        $scope.gifOptions.videos = $rootScope.trimmedVideoPath;
        gifshot.createGIF({'video': $rootScope.trimmedVideoPath}, function (obj) {

            if (!obj.error) {
                console.log('video is converted to GIF');
                $scope.gifSrc = obj.image;
                //$state.go('app.video');

                console.log(obj.image);

                var image = document.createElement("img");
                var elem = angular.element(image);
                elem.attr('ng-src', 'img/ionic.png');
                elem.attr('rel:auto_play', 1);
                elem.attr('rel:animated_src', $scope.gifSrc);
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
                    console.log('*********gif is parsed***********************************');
                    frames = sup1.get_frames();
                    frameOffsets = sup1.get_frameOffsets();
                    for (var i = 0; i < frames.length; i++) {
                        var tmpCanvas = document.createElement('canvas');
                        var data = frames[i].data;
                        var x = frameOffsets[i].x;
                        var y = frameOffsets[i].y;
                        tmpCanvas.getContext("2d").putImageData(data, x, y);
                        $rootScope.images.push(tmpCanvas.toDataURL());
                    }
                    $ionicLoading.hide();
                    $state.go('app.photo', {id: 3});
                });

            }
        });
    }

})
