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

    $scope.listStatus = {msg:'Hide The Hotel List', isHide:false};
    $scope.changeListStatus = function() {
      if($scope.listStatus.isHide == false) {
        $scope.listStatus.isHide = true;
        $scope.listStatus.msg = 'Show The Hotel List';
      } else {
        $scope.listStatus.isHide = false;
        $scope.listStatus.msg = 'Hide The Hotel List';
      }
    }
    $scope.calculateAddress = function(value) {
      return `${value.street}, ${value.city}, ${value.province}`;
    };

    $http.get(`${$rootScope.url}/hotels`).then(function (res) {
      $scope.hotels = res.data;
    });

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

    $scope.deleteRoomType = function(roomType) {

      const confirm = $mdDialog.confirm()
        .title('Would you like to delete this room type?')
        .textContent('All the rooms under this room type will be deleted as well')
        .ok('Confirm')
        .cancel('I change my mind');

      $mdDialog.show(confirm).then(function() {

        const deleteRoomTypeUrl = `${$rootScope.url}/room-types/${roomType.id}`;

        $http.delete(deleteRoomTypeUrl).then(function (res) {
          $rootScope.popUp("successfully delete this room type", 'Success');

          const index = $scope.roomTypes.indexOf(roomType);

          if(index != -1) {
            $scope.roomTypes.splice(index, 1);
          }
        }, function (err) {
          console.error(err);
          $rootScope.popUp('Failed to delete this room type');
        })
      });
    }
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
