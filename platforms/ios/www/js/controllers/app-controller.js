//angular.module('gifer.app-controller', [])

controllers.controller('AppCtrl', function ($scope, $cordovaDevice, $rootScope, $state, $cordovaPreferences, $ionicPlatform, $ionicLoading, makeID, customPopup, $cordovaGoogleAds, $window) {

    //initialize it
    $scope.transcodeProgress = 0;

    $scope.photo = function (id) {
        console.log("photo id is equal to: " + id);
        $state.go('app.photo', {id: id});
    }

    //console.log(makeID.getNewID);
    //customPopup.showAlert('Meder','Meder kandai');

    $scope.video = function (id) {
        $rootScope.originalVideoPath = '';
        if (id == 0) {
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

                        //with transcoding..
                        videoTrancode(result.filePath, function (transcodedVideoPath) {
                            $rootScope.originalVideoPath = transcodedVideoPath;
                            $state.go('app.trim', {id: id});
                        })

                        //without trancoding
                        // $rootScope.originalVideoPath = result.filePath;
                        // $state.go('app.trim', {id: id});


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

                // $timeout(function() {
            //   $cordovaGoogleAds.showInterstitial();
            // }, 1000); 


            });
        }
        else {
            $state.go('app.trim', {id: id});
        }
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
            scope: $scope,
            template: '<progress max="1" value="{{transcodeProgress}}" class=""></progress>Transcoding...'
        })

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
                fps: 10, // optional (android only), defaults to 24
                audioChannels: 2, // optional, number of audio channels, defaults to 2
                audioSampleRate: 44100, // optional, sample rate for the audio, defaults to 44100
                audioBitrate: 128000, // optional, audio bitrate for the video in bits, defaults to 128 kilobits (128000)
                progress: function (info) {
                    $scope.$apply(function () {
                        $scope.transcodeProgress = info/100;
                    })
                } // optional, see docs on progress
            }
        );


        function videoTranscodeSuccess(result) {
            // result is the path to the transcoded video on the device
            $ionicLoading.hide();
            $scope.transcodeProgress = 0;
            success_callback(result);
            console.log('videoTranscodeSuccess, result: ' + result);
        }

        function videoTranscodeError(err) {
            $ionicLoading.hide();
            $scope.transcodeProgress = 0;
            customPopup.showAlert('Error!', 'Cannot convert video into suitable format');
            console.log('videoTranscodeError, err: ' + err);
        }
    }


    $scope.edit = function () {
        $state.go('app.edit');
    }

    $scope.browse = function () {
        $state.go('app.browse');
    }

    $scope.settings = function () {
        $state.go('app.settings');
    }

    $ionicPlatform.ready(function () {

        $cordovaPreferences.fetch('isFirstTime')
            .success(function (value) {
                if (value == null) {
                    $cordovaPreferences.store('isFirstTime', true);
                } else if (value == true) {
                    $cordovaPreferences.store('isFirstTime', false);
                }
            })
            .error(function (error) {
            })


            var adMobIdAndroid = {
                    admob_banner_key: 'ca-app-pub-5609407643536100/7546850871',
                    admob_interstitial_key: 'ca-app-pub-5609407643536100/2977050471'
                };

                var adMobIdiOS = {
                    admob_banner_key: 'ca-app-pub-5609407643536100/7407250079',
                    admob_interstitial_key: 'ca-app-pub-5609407643536100/1360716476'
                };

                var adMobPosition = {
                    BOTTOM_CENTER: 8
                }; 

                $rootScope.adMobPosition = adMobPosition;

                var platform = $cordovaDevice.getPlatform();
                if (platform == 'iOS') {
                    $rootScope.adMobId = adMobIdiOS;
                }else if (platform == 'Android') {
                    $rootScope.adMobId = adMobIdAndroid;   
                }

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

                try {
                    console.log('Prepare Interstitial Ad');      
                    $cordovaGoogleAds.prepareInterstitial({
                        adId: $rootScope.adMobId.admob_interstitial_key,
                        isTesting: true,
                        autoShow: false
                    });
                     
                } catch (e) {
                    alert(e);
                }
    })

});
