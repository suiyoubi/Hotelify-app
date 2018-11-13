angular.module('myApp.reservation', [
  'ngMaterial',
  'ngMessages',
  'ngRoute'])
.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/reservation', {
    templateUrl: 'reservation/reservation.html',
    controller: 'reservationController'
  });
}])
.controller('reservationController', function ($scope, $http, $rootScope, $mdDialog) {
  $scope.initHotelInfo = function() {
    $scope.hotels = $rootScope.hotels;
    console.log($scope.hotels);
  };

  $scope.hotelDetail = function(hotel) {
    $mdDialog.show({
      controller: 'makeReservationController',
      templateUrl: 'makeReservation.tmpl.html',
      parent: angular.element(document.body),
      clickOutsideToClose:true,
      locals:{ hotel },
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    });
  };

})
.controller('makeReservationController', function ($scope, $mdDialog, $http, $rootScope, hotel) {
  var hotelId = hotel.id;
  //$http.get
  var roomType = ["single", "double", "总统套房"];
  var tags = ["free breakfast", "good service", "sea view"];
  var coupons = ["freeNight", "20% off"];
  $scope.selected = [];
  this.startDate = $rootScope.checkinDate;
  this.endDate = $rootScope.checkoutDate;
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