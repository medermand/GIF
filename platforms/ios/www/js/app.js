// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('gifer', ['ionic', 'gifer.controllers', 'gifer.services', 'gifer.directives', 'ngCordova', 'ionicLazyLoad', 'ngDraggable'])


  .run(function ($ionicPlatform, $rootScope, $ionicConfig) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
      console.log("rootScope app color is ");
      $ionicConfig.views.swipeBackEnabled(false);
      $rootScope.appColor = "bar-calm";
      console.log($rootScope.appColor);
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $cordovaAppRateProvider) {

    document.addEventListener('deviceready' ,function() {

    var prefs = {
     language: 'en',
     appName: 'GIFER',
     openStoreInApp: false,
     iosURL: '<my_app_id>',
     androidURL: 'market://details?id=<package_name>',
     windowsURL: 'ms-windows-store:Review?name=<...>'
   };

   $cordovaAppRateProvider.setPreferences(prefs);
  }, false);

    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      .state('app.menu', {
        url: '/menu',
        views: {
          'menuContent': {
            templateUrl: 'templates/menu.html',
            controller: 'AppCtrl'
          }
        }
      })

      .state('app.photo', {
        url: '/photo/:id',
        views: {
          'menuContent': {
            templateUrl: 'templates/photo.html',
            controller: 'PhotoCtrl'
          }
        },
        params: {
          id: 0
        }
      })

      .state('app.video', {
        url: '/video',
        views: {
          'menuContent': {
            templateUrl: 'templates/video.html',
            controller: 'VideoCtrl'
          }
        },
        params: {
          id: 0
        }
      })

      .state('app.trim', {
        url: '/trim/:id',
        views: {
          'menuContent': {
            templateUrl: 'templates/trim.html',
            controller: 'VideoCtrl'
          }
        },
        params: {
          id: 0
        }
      })


      .state('app.edit', {
        url: '/edit',
        views: {
          'menuContent': {
            templateUrl: 'templates/edit.html',
            controller: 'EditCtrl'
          }
        }
      })

      .state('app.browse', {
        url: '/browse',
        views: {
          'menuContent': {
            templateUrl: 'templates/browse.html',
            controller: 'BrowseCtrl'
          }
        }
      })

      .state('app.settings', {
        url: '/settings',
        views: {
          'menuContent': {
            templateUrl: 'templates/settings.html',
            controller: 'SettingsCtrl'
          }
        }
      })
    ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/menu');
  });
