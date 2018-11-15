'use strict';

angular.module('myApp.browse', [
  'ngMaterial',
  'ngMessages',
  'firebase',
  'ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/browse', {
      templateUrl: 'browse_hotels/browse.html',
      controller: 'browseController'
    });
  }])
  .controller('browseController', function ($rootScope, $scope, $mdDialog, $http) {

    $scope.retrieveHotelInfo = function(){
      const url = `${$rootScope.url}/hotels`;

      $http({
        url: url,
        method: "GET"
      }).then(function (res) {
        $scope.hotels = res.data;
        $scope.hotels.forEach(function (value) {
          if(value.address_id!=null){
            value.address = value.street + ", " + value.city + ", " + value.province;
          }
        });
        console.log($scope.hotels);
      }, function (err) {
        console.error(err);
      });
    };

    $scope.searchHotel = function () {

      // GET api/hotels/
      const url = `${$rootScope.url}/hotels/feature/search`;
      console.log($scope.searchObj);

      $http({
        url: url,
        method: "GET",
        params: $scope.searchObj,
      }).then(function (res) {

        console.log(res);
        $scope.hotels = res.data;
        $scope.hotels.forEach(function (value) {
          if(value.address_id!=null){
            value.address = value.street + ", " + value.city + ", " + value.province;
          }
        });
      }, function (err) {
        console.error(err);
      });
    };

    $scope.hotelDetail = function(hotel) {

      const storage = firebase.storage();
      const storageRef = storage.ref(`${hotel.id}/image.png`);

      storageRef.getDownloadURL().then(function (url) {
        $scope.imageUrl = url;
        console.log(url);

        $mdDialog.show({
          controller: 'browseHotelController',
          templateUrl: 'browse.tmpl.html',
          parent: angular.element(document.body),
          clickOutsideToClose:true,
          locals:{ hotel, url },
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        });

      }, function (err) {

        $mdDialog.show({
          controller: 'browseHotelController',
          templateUrl: 'browse.tmpl.html',
          parent: angular.element(document.body),
          clickOutsideToClose:true,
          locals:{ hotel, url:null },
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        });
      });
    };

  })
.controller('browseHotelController', function ($scope, $mdDialog, $http, $rootScope, hotel, url) {
  var hotelId = hotel.id;
  //$http.get
  $scope.selected = [];
  this.startDate = new Date();
  this.endDate = new Date();

  $scope.hotelInfo = hotel;
  $scope.url = url;

  $scope.makeReservation = function(){
    //$http.post
    // search specific hotel in given interval
    console.log($scope.startDate,$scope.endDate, $scope.hotelInfo.id);
    // redirect to reservation page if successed
  };

  $scope.cancel = function() {
    console.log('cancel');
    $mdDialog.cancel();
  };

});
