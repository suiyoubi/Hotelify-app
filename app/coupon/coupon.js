'use strict'

angular.module('myApp.coupon', [
  'ngMaterial',
  'ngMessages',
  'ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/coupon', {
      templateUrl: 'coupon/coupon.html',
      controller: 'couponController'
    });
  }])
  .controller('couponController', function ($scope, $mdDialog, $rootScope, $http) {

    $scope.couponTypes = [
      {id: 1, discount_type: '%', value: 30},
      {id: 2, discount_type: '$', value: 50},
    ];

    $scope.checkCustomer = function() {

      if(!$scope.coupon.username) return;

      const getCustomerUrl = `${$rootScope.url}/customers/${$scope.coupon.username}`;

      $http.get(getCustomerUrl).then(function (res) {
        $rootScope.popUp('Customer is valid!', 'success');
        $scope.isChecked = true;
      }, function (err) {
        $rootScope.popUp('customer username does not exists');
      });

    }
    $scope.generateCouponTypeValue = function(couponType) {
      return `${couponType.value}${couponType.discount_type} off`;
    };

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

    $scope.selectHotel = function (hotel) {
      $scope.selectedHotel = hotel;
    };

  });
