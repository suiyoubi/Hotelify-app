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
  .controller('hotelManagementController', function ($scope, $http, $rootScope) {

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

    $scope.hotels = [
      {brand_name: "ex", branch_name: "ex", street: "ex"},
      {brand_name: "ex", branch_name: "ex", street: "ex"},
    ];

    $scope.manageHotel = function (hotel) {
      console.error(hotel);
      $scope.selectedHotel = hotel;
    };

  });
