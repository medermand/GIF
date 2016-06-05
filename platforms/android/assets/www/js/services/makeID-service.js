/**
 * Created by Meder on 02/06/16.
 */
//angular.module('gifer.services', [])
services.factory('makeID', function () {

  var getNewID = function () {
    console.log('they are calling me');
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  return {
    getNewID: getNewID(),

  }
})
