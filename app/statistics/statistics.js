'use strict';

angular.module('myApp.statistics', [
  'ngMaterial',
  'ngMessages',
  'ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/statistics', {
      templateUrl: 'statistics/statistics.html',
      controller: 'statisticsController'
    });
  }])
  .controller('statisticsController', function ($scope, $http, $rootScope, $location) {

    $scope.yesOrNo = function(number) {
      if(number) return 'Yes';
      return 'No';
    }

    $http.get(`${$rootScope.url}/hotels`).then(function (res) {
      $scope.hotels = res.data;

      res.data.forEach(hotel => {
        $http.get(`${$rootScope.url}/stats/hotel/${hotel.id}/revenue`).then(function (res) {
          if($scope.hotelIdMap[hotel.id]) {
            $scope.hotelIdMap[hotel.id].revenue = res.data.result;
          } else {
            $scope.hotelIdMap[hotel.id] = {};
            $scope.hotelIdMap[hotel.id].revenue = res.data.result;
          }
        });
      });
    });//

    $scope.hotelIdMap = {};

    $http.get($rootScope.url + '/stats/user-count').then(function (res) {
      $scope.user_count = res.data.result;
    }, function (err) {
      console.error(err);
    });//

    $http.get($rootScope.url + '/stats/hotel-count').then(function (res) {
      $scope.hotel_count = res.data.result;
    }, function (err) {
      console.error(err);
    });//

    $http.get($rootScope.url + '/stats/reservation-count').then(function (res) {
      $scope.reservation_count = res.data.result;
    }, function (err) {
      console.error(err);
    });//

    $http.get($rootScope.url + '/stats/hotel-room-count').then(function (res) {
      $scope.number_rooms_detail = res.data;

      res.data.forEach(hotel => {
        if(!$scope.hotelIdMap[hotel.id]) {
          $scope.hotelIdMap[hotel.id] = {};
          $scope.hotelIdMap[hotel.id].roomCount = hotel.result;
        } else{
          $scope.hotelIdMap[hotel.id].roomCount = hotel.result;
        }
      });
    }, function (err) {
      console.error(err);
    });//

    $http.get($rootScope.url + '/stats/max-room-reserved').then(function (res) {
      $scope.max_room_per_reservation = res.data.numOfRoomsReserved;
    }, function (err) {
      console.error(err);
    });//

    $http.get($rootScope.url + '/stats/min-room-reserved').then(function (res) {
      $scope.min_room_per_reservation = res.data.numOfRoomsReserved;
    }, function (err) {
      console.error(err);
    });//

    $http.get($rootScope.url + '/stats/most-popular-tag').then(function (res) {
      $scope.most_popular_tag = res.data;
      $scope.tags = [res.data];
    }, function (err) {
      console.error(err);
    });//

    $http.get($rootScope.url + '/stats/revenue').then(function (res) {
      $scope.total_revenue = res.data.result;
    }, function (err) {
      console.error(err);
    });//

    $http.get($rootScope.url + '/stats/hotels-booked-by-all-users').then(function (res) {
      res.data.forEach(hotel => {
        if(!$scope.hotelIdMap[hotel.id]) {
          $scope.hotelIdMap[hotel.id] = {};
          $scope.hotelIdMap[hotel.id].bookedByAllUsers = true;
        } else{
          $scope.hotelIdMap[hotel.id].bookedByAllUsers = true;
        }
      });
    }, function (err) {
      console.error(err);
    });//

    $http.get($rootScope.url + '/stats/reservations-per-hotel').then(function (res) {
      $scope.reservation_per_hotel = res.data;
      res.data.forEach(hotel => {
        if(!$scope.hotelIdMap[hotel.id]) {
          $scope.hotelIdMap[hotel.id] = {};
          $scope.hotelIdMap[hotel.id].reservationCount = hotel.result;
        } else{
          $scope.hotelIdMap[hotel.id].reservationCount = hotel.result;
        }
      });
    }, function (err) {
      console.error(err);
    });
  });
