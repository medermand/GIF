/**
 * Created by Meder on 03/06/16.
 */
services.factory('customPopup', function($ionicPopup){

  var showAlert = function(title1, template1){
    var alertPopup = $ionicPopup.alert({
      title: title1,
      template: template1
    });

    alertPopup.then(function(res) {
    });
  }

  return{
    showAlert: showAlert
  }
})
