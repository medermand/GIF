/**
 * Created by Meder on 01/06/16.
 */

//angular.module('gifer.directive', ['ui.slider'])
directives.directive('player', function () {
  'use strict';
  return {
    restrict: 'E',
    link: function (scope, element, attrs) {
      var interval = 0,
        video = element.find('video');

      video.on('loadeddata', function (e) {
        scope.$apply(function () {
          scope.start = 0;
          scope.end = e.target.duration;
          scope.current = scope.start;
          scope.currentPercent = scope.start;
          scope.duration = scope.end;
        });
      });

      video.on('timeupdate', function (e) {
        scope.$apply(function () {
          scope.current = (e.target.currentTime - scope.start);
          scope.currentPercent = (scope.current / (scope.end - scope.start)) * 100;
          if (e.target.currentTime < scope.start) {
            e.target.currentTime = scope.start;
          }
          if (e.target.currentTime > scope.end) {
            if (video[0].paused === false) {
              e.target.pause();
            } else {
              e.target.currentTime = scope.start;
            }
          }
        });
      });

      scope.onSliderChange = function () {
        //video[0].pause();
        if (interval) {
          window.clearInterval(interval);
        }
        interval = window.setTimeout(function () {
          video[0].currentTime = scope.start + ((scope.currentPercent / 100 ) * (scope.end - scope.start));
        }, 300);
      };

      scope.$watch('start', function (num) {
        if (num !== undefined) {
          video[0].currentTime = num;
        }
      });
      scope.$watch('end', function (num) {
        if (num !== undefined) {
          video[0].currentTime = num;
        }
      });
    },
    templateUrl: 'templates/player.html'
  };
})
