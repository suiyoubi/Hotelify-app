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
  .controller('quickBookController', function ($rootScope, $scope, $mdDialog, $location) {

    $scope.request = { interval: {} };
    $scope.request.interval.startDate = new Date();
    $scope.request.interval.endDate = new Date();

    $scope.bookRequest = function () {
      //todo send http request
     console.log($scope.request);
     $rootScope.hotels = [
       {id:1, branch_name: 'haus hotel', brand_name: 'haohao', address: 'fake add 1'},
       {id:2, branch_name: 'kanglong hotel', brand_name: 'haohao', address: 'fake add 2'},
       {id:3, branch_name: 'rex hotel', brand_name: 'xixi', address: 'fake add 3'},
       {id:4, branch_name: 'jingrui hotel', brand_name: 'xixi', address: 'add 4'}
     ];
     $rootScope.checkinDate = $scope.request.interval.startDate;
     $rootScope.checkoutDate = $scope.request.interval.endDate;
     $location.path('/reservation');
    };
  });
