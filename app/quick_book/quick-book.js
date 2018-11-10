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
  .controller('quickBookController', function ($scope, $mdDialog) {

    $scope.request = { interval: {} };
    $scope.request.interval.startDate = new Date();
    $scope.request.interval.endDate = new Date();

    $scope.bookRequest = function () {

      //todo send http request
     console.error($scope.request);
    };
  });
