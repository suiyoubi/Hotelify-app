'use strict';

angular.module('myApp.hotelManagement', [
  'ngMaterial',
  'ngMessages',
  'ngTable',
  'ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/hotel_management', {
      templateUrl: 'hotel_management/hotel_management.html',
      controller: 'hotelManagementController'
    });
  }])
  .controller('hotelManagementController', function ($scope, $http, $rootScope, $mdDialog) {

    $scope.searchHotel = function () {

      // GET api/hotels/
      const url = `${$rootScope.url}/hotels/feature/search`;

      $http({
        url: url,
        method: "GET",
        params: $scope.searchObj,
      }).then(function (res) {

        console.error(res);
        $scope.hotels = res.data;
      }, function (err) {
        console.error(err);
      });
    };

    $scope.hotels = [];

    $scope.manageHotel = function (hotel) {
      console.error(hotel);
      $scope.selectedHotel = hotel;

      //get all rooms for the hotel

      const getRoomsUrl = `${$rootScope.url}/hotels/${hotel.id}/room-types`;

      console.log(getRoomsUrl);

      $http.get(getRoomsUrl).then(function (res) {
        $scope.roomTypes = res.data;
      }, function (err) {
        console.error(err);
      })
    };

    $scope.addRoom = function() {
      $mdDialog.show({
        controller: 'roomTypeInputController',
        templateUrl: 'dialog2.tmpl.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      }).then( function (roomType) {

        const addRoomForHotelUrl = `${$rootScope.url}/hotels/${$scope.selectedHotel.id}/room-types`;
        $http.post(addRoomForHotelUrl, roomType).then(function (res) {
          roomType.id = res.data.id;
          $scope.roomTypes.push(roomType);
        }, function (err) {
          console.error(err);
        });

      });
    };

    $scope.updateHotel = function () {

      const updateHotelUrl = `${$rootScope.url}/hotels/update`;
      $http.put(updateHotelUrl, $scope.selectedHotel).then(function (res) {
        console.log(res);
        $rootScope.popUp('You have updated the info!', 'success', 'great');
      }, function (err) {
        console.error(err);
        $rootScope.popUp('update failed! please check your input');
      });
    }
  });
