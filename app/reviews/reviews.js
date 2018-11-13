'use strict';

angular.module('myApp.reviews', [
  'ngMaterial',
  'ngMessages',
  'ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/reviews', {
      templateUrl: 'reviews/reviews.html',
      //controller: 'reviewsController'
    });
  }])
  .controller('reviewsController', function ($scope, $http, $rootScope, $location) {

    $scope.rowCollection = [];
    $scope.rawList = [];

    $scope.searchHotel = function () {

      // GET api/hotels/
      const url = `${$rootScope.url}/hotels/feature/search`;

      console.log(url);
      $http.get(url, {
        params: $scope.searchObj
      }).then(function (res) {

        $scope.hotels = res.data;
      }, function (err) {
        console.error(err);
      });
    };

    $scope.changeReviews = function (hotel) {
      $scope.selectedRow = hotel;

      // GET api/hotels/{hotelId}/reviews
      const url = `${$rootScope.url}/reviews/hotel/${hotel.id}`;
      $http.get(url).then(function (res) {
        console.log(res);
        $scope.rawList = res.data;
      }, function (err) {
        console.error(err);

        $rootScope.popUp('getting the reviews failed');
      });
    };
  });
