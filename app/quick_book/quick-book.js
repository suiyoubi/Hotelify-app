'use strict'

angular.module('myApp.quickBook', [
  'ngMaterial',
  'ngMessages',
  'ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/quick-book', {
      templateUrl: 'quick_book/quick-book.html',
      controller: 'quickBookController'
    });
  }])
  .controller('quickBookController', function ($rootScope, $scope, $mdDialog, $location, $http) {

    $scope.request = {};
    $scope.request.startDate = new Date();
    $scope.request.endDate = new Date();

    $scope.bookRequest = function () {

      const request = $scope.request

      console.error($scope.request);
      const checkAvailabilitiesUrl = `${$rootScope.url}/hotels/availabilities`;
      $http.get(checkAvailabilitiesUrl, {
        params: $scope.request
      }).then(function (res) {
        console.log(res);

        if(res.data.length == 0) {
          $rootScope.popUp('Sorry there is no hotel satisfy your need on Hotelify. ' +
            'Please try to book for less rooms or choose other date range.');
          $scope.request = {};
          return;
        }

        $rootScope.reservation = {};

        $rootScope.reservation.hotels = res.data;
        $rootScope.reservation.checkin_date = $scope.request.checkin_date;
        $rootScope.reservation.checkout_date = $scope.request.checkout_date;

        $location.path('/reservation');
      }, function (err) {
        console.error(err);
      })
      //todo send http request
     console.log($scope.request);
    };
  });
