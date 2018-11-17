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
    $scope.minDate = new Date();

    $scope.inputCheck = function(request) {

      if(!request) {
        $rootScope.popUp('Please specify booking information');
        return false;
      } else if(!request.rooms) {
        $rootScope.popUp('Please specify how many rooms you wanna book');
        return false;
      } else if(!request.checkin_date || !request.checkout_date || request.checkin_date > request.checkout_date) {
        $rootScope.popUp('Please specify correct date information');
        return false;
      }

      return true;
    }
    $scope.bookRequest = function () {

      const request = $scope.request;

      if(!$scope.inputCheck(request)) {
        return;
      }

      const checkAvailabilitiesUrl = `${$rootScope.url}/hotels/availabilities`;
      $http.get(checkAvailabilitiesUrl, {
        params: $scope.request
      }).then(function (res) {
        console.log(res);

        if(res.data.length == 0) {
          $rootScope.popUp('Sorry there is no hotel that satisfies your needs on Hotelify. ' +
            'Please change your reservation details.');
          $scope.request = {};
          return;
        }

        $rootScope.reservation = {};

        $rootScope.reservation.hotels = res.data;
        $rootScope.reservation.checkin_date = $scope.request.checkin_date;
        $rootScope.reservation.checkout_date = $scope.request.checkout_date;
        $rootScope.reservation.nights =
          Math.floor(($scope.request.checkout_date - $scope.request.checkin_date) / (1000*60*60*24));

        $location.path('/reservation');
      }, function (err) {
        console.error(err);
      });
    };
  });
