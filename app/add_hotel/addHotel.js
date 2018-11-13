'use strict'

angular.module('myApp.addHotel', [
  'ngMaterial',
  'ngMessages',
  'ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/add_hotel', {
      templateUrl: 'add_hotel/add_hotel.html',
      controller: 'addHotelController'
    });
  }])
  .controller('addHotelController', function ($scope, $mdDialog, $rootScope, $http) {

    $scope.hotel = {};
    $scope.roomTypes = [];

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

        const addRoomUrl = `${$rootScope.url}/hotels/${hotel_id}/room-types`;

        $scope.roomTypes.forEach( function (roomType) {

          $http.post(addRoomUrl, roomType).then(function (res) {
            console.log('success create room');
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
