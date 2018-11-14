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

  });
