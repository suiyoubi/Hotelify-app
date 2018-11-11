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
  .controller('addHotelController', function ($scope, $mdDialog, $rootScope) {

    $scope.hotel = {};
    $scope.roomTypes = [];

    $scope.roomTypes.push({typeName:'romm1', number:500, price:300, description:'description', occupancy:3});

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

      $scope.hotel.roomTypes = $scope.roomTypes;

      console.error($scope.hotel);
    }
  }).controller('roomTypeInputController', function ($scope, $mdDialog) {

    $scope.roomType = {};

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.addIt = function () {

      if($scope.roomType.typeName) {
        $mdDialog.hide($scope.roomType);
      }
    };
});
