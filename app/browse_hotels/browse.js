'use strict';

angular.module('myApp.browse', [
  'ngMaterial',
  'ngMessages',
  'ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/browse', {
      templateUrl: 'browse_hotels/browse.html',
      controller: 'browseController'
    });
  }])
  .controller('browseController', function ($rootScope, $scope, $mdDialog, $http) {
    //$http.get
    $scope.hotels = [
      {id:1, branchName: 'haus hotel', brandName: 'haohao', address: 'fake add 1'},
      {id:2, branchName: 'kanglong hotel', brandName: 'haohao', address: 'fake add 2'},
      {id:3, branchName: 'rex hotel', brandName: 'xixi', address: 'fake add 3'},
      {id:4, branchName: 'jingrui hotel', brandName: 'xixi', address: 'add 4'}
    ];

    $scope.searchHotel = function () {
      // GET api/hotels/
      const url = `${$rootScope.url}/hotels/search`;

      console.log(url);
      $http.get(url, {
        params: $scope.searchObj
      }).then(function (res) {

        $scope.hotels = res.data;
      }, function (err) {
        console.err(err);
      });
    };

    $scope.hotelDetail = function(hotel) {
      $mdDialog.show({
        controller: 'anotherController',
        templateUrl: 'makeReservation.tmpl.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        locals:{ hotel },
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      });
    };

  })
  .controller('anotherController', function ($scope, $mdDialog, $http, $mdToast, hotel) {
    var hotelId = hotel.id;
    //$http.get
    var roomType = ["single", "double", "总统套房"];
    var tags = ["free breakfast", "good service", "sea view"];
    var coupons = ["freeNight", "20% off"];
    $scope.selected = [];
    this.startDate = new Date();
    this.endDate = new Date();
    this.roomSelected = "";

    $scope.roomType = roomType;
    $scope.hotelInfo = hotel;
    $scope.tags = tags;
    $scope.coupons = coupons;


    $scope.makeReservation = function(){
      //$http.post
      console.log($scope.roomSelected);
      console.log($scope.selected);
      console.log($scope.startDate,$scope.endDate);
    };

    $scope.cancel = function() {
      console.log('cancel');
      $mdDialog.cancel();
    };

    $scope.toggle = function (item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      }
      else {
        list.push(item);
      }
    };

    $scope.exists = function (item, list) {
      return list.indexOf(item) > -1;
    };

    $scope.isIndeterminate = function() {
      return ($scope.selected.length !== 0 &&
          $scope.selected.length !== $scope.roomType.length);
    };

    $scope.isChecked = function() {
      return $scope.selected.length === $scope.roomType.length;
    };
  });
