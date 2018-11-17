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

    $scope.coupon = {};
    $scope.couponTypes = $rootScope.couponTypes;

    $http.get(`${$rootScope.url}/hotels`).then(function (res) {
      $scope.hotels = res.data;
    });

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
      $scope.coupon.hotel_id = hotel.id;
    };

    $scope.inputCheck = function() {

      const coupon = $scope.coupon;
      if(!coupon) {
        $rootScope.popUp('Please input coupon information');
        return false;
      } else if(!coupon.coupon_type_id || !coupon.expire_date) {
        $rootScope.popUp('Please provide all the information');
        return false;
      }
      return true;
    };

    $scope.distributeCoupon = function () {

      if(!$scope.inputCheck()) {
       return;
      }

      const distributeCouponUrl = $scope.toEveryUser ?
        `${$rootScope.url}/coupons/createAll` :
        `${$rootScope.url}/coupons/create`;

      if(!$scope.toEveryUser && !$scope.coupon.username) {
        $rootScope.popUp('please provide username');
        return;
      }

      console.log(distributeCouponUrl);
      console.log($scope.coupon);

      $http.post(distributeCouponUrl, $scope.coupon).then(function (res) {
        console.log(res);
        $rootScope.popUp('You have successfully distributed coupons!');
      }, function (err) {
        console.error(err);
      });
    };
  });

