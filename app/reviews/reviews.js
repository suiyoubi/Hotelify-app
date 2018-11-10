'use strict';

angular.module('myApp.reviews', [
  'ngMaterial',
  'ngMessages',
  'ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/reviews', {
      templateUrl: 'reviews/reviews.html',
      controller: 'reviewsController'
    });
  }])
  .controller('reviewsController', function ($scope, $http, $rootScope, $location) {

  });
