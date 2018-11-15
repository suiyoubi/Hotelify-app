'use strict'

angular.module('myApp.addHotel', [
  'ngMaterial',
  'ngMessages',
  'ngRoute',
  'firebase',
  'ngFileUpload',
])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/add_hotel', {
      templateUrl: 'add_hotel/add_hotel.html',
      controller: 'addHotelController'
    });
  }])
  .controller('addHotelController', function ($scope, $mdDialog, $rootScope, $http) {

    $scope.hotel = {};
    $scope.roomTypes = [];

    $scope.selectFile  = function (file) {
      console.error(file);
      $scope.file = file;
    };
    $scope.uploadFile = function (file, id) {

      console.error('try to update the file:', file);
      var storageRef = firebase.storage().ref();
      storageRef = storageRef.child(`${id}/image.${file.name.split('.').pop()}`);
      storageRef.put(file).then(function (res) {
        console.log(res);
        $rootScope.popUp('you have uploaded your image successfully', 'great');
        $scope.file = null;
        $scope.hotel = null;
      }, function (err) {
        console.error(err);
      });
    };

    $scope.addRoom = function() {
      $mdDialog.show({
        controller: 'roomTypeInputController',
        templateUrl: 'dialog2.tmpl.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      }).then( function (roomType) {
          $scope.roomTypes.push(roomType);
      });
    };

    $scope.addHotel = function () {

      if(!checkInput($scope.hotel, $rootScope.popUp)) {
        return;
      }

      const addHotelUrl = $rootScope.url + '/hotels/create';

      $http.post(addHotelUrl, $scope.hotel).then(function (res) {
        console.log(res);
        const hotel_id = res.data.id;

        $rootScope.popUp('You have created the hotel, please wait for the image to be uploaded', 'success');
        console.log('success create room');
        $scope.uploadFile($scope.file, hotel_id);

        const addRoomUrl = `${$rootScope.url}/hotels/${hotel_id}/room-types`;

        $scope.roomTypes.forEach( function (roomType) {

          $http.post(addRoomUrl, roomType).then(function (res) {

          }, function (err) {
            console.error(err);
          });
        }).then(function () {
          $rootScope.popUp('You have created a hotel','Success', 'Cool');
        });


      }, function (err) {
        console.error(err);
      });
    };

  }).controller('roomTypeInputController', function ($scope, $mdDialog, $rootScope) {

    $scope.roomType = {};

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.addIt = function () {

      if($scope.roomType.type_name) {
        $mdDialog.hide($scope.roomType);
      } else {
        $rootScope.popUp('please complete all the fields!');
      }
    };
});

function checkInput(hotel, popUp) {
  if(!hotel.branch_name) {
    popUp('Please provide at least the hotel name!');
    return false;
  }
  if(!hotel.country || !hotel.province || !hotel.postal_code ||!hotel.city ||!hotel.street) {
    popUp('Please provide the complete address info so that people know where your hotel is!');
    return false;
  }

  return true;
}
