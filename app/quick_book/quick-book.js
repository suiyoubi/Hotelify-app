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
       { address_id: "3",
         branch_name: "UBC",
         brand_name: "Walter Gage",
         city: "Vancouver",
         country: "Canada",
         description: "this is a good one",
         id: "1",
         phone_number: "6048221020",
         postal_code: "V6T 1K2",
         property_class: "1",
         province: "British Columbia",
         street: "5959 Student Union Blvd"},
       { address_id: "30",
         branch_name: "Ponderosa Oak house 7-002",
         brand_name: "JR Inc. Co. Ltd.",
         city: "Vancouver",
         country: "Canada",
         description: "this is a better one",
         id: "3",
         phone_number: "7786814260",
         postal_code: "V6T 1Z4",
         property_class: "5",
         province: "British Columbia",
         street: "2075 West Mall"}
     ];
     $rootScope.checkinDate = $scope.request.interval.startDate;
     $rootScope.checkoutDate = $scope.request.interval.endDate;
     $location.path('/reservation');
    };
  });
