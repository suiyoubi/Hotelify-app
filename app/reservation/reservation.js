'use strict'

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

    $rootScope.popUp(`Hotelify has found ${$rootScope.reservation.hotels.length} hotels that satisfy your need!`, 'Awesome');

    $scope.hotels = $rootScope.reservation.hotels;
    $scope.hotels.forEach(function (value) {
      if(value.address_id!=null){
        value.address = value.street + ", " + value.city + ", " + value.province;
      }
    });
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
  $scope.initRoomInfo = function () {
    //init room info
    $scope.roomType = {};
    $scope.displayTags = [];

    const hotelRoomsAvaUrl = `${$rootScope.url}/hotels/${hotel.id}/availabilities`;

    $http.get(hotelRoomsAvaUrl, {
      params: {
        checkin_date: $rootScope.reservation.checkin_date,
        checkout_date: $rootScope.reservation.checkout_date,
      },
    }).then(function (res) {

      const availableRoom = res.data;

      // only display one room for each room type
      // only support reserving one room at a time currently
      // todo: support reserving multiple room (if time permitted)
      availableRoom.forEach(function (value) {
        if($scope.roomType[value.type_name]==undefined){
          $scope.roomType[value.type_name] = value;
          $scope.roomType[value.type_name].count = 1;
          $scope.roomType[value.type_name].addedCount = 0;
        } else {
          $scope.roomType[value.type_name].count += 1;
        }
      });
    }, function (err) {
      console.error(err);
    })


    // console.log($scope.roomType);
    // // init tag
    // // get all tags of this hotel
    // var url = $rootScope.url + "/tags/hotel/" + hotel.id;
    // $http({
    //   url: url,
    //   method: "GET"
    // }).then(function (res) {
    //   console.log(res);
    //   $scope.currentTags = res.data;
    //   $scope.displayTags = [];
    //   var cycle = $scope.currentTags.length > 3 ? 3
    //       : $scope.currentTags.length;
    //   for (var i = 0; i < cycle; i++) {
    //     $scope.displayTags[i] = $scope.currentTags[i].tag_name;
    //   }
    // }, function (err) {
    //   // handle error here
    //   console.log(err);
    // });
    // $scope.tags = ["free breakfast", "good service", "sea view"];
  };

  $scope.roomSelected ={};
  $scope.selectedRoomTypes = [];
  $scope.hotelInfo = hotel;

  $scope.makeReservation = function(){
    //$http.post
    // todo: connect to db
    // todo: date format
    if(angular.equals($scope.roomSelected, {})){
      console.log("no room selected");
      document.getElementById("reservationWarning").style.visibility = "visible";
      return;
    }
    console.log($scope.roomSelected);
    console.log($scope.selected);
    console.log($rootScope.checkinDate,$rootScope.checkoutDate);
    $mdDialog.show(
        $mdDialog.alert()
        .clickOutsideToClose(true)
        .title('Success')
        .textContent('Your reservation has been proceed!')
        .ok('OK')
    )
  };

  $scope.addRoom = function(room){

    if(room.addedCount == room.count) return;
    room.addedCount += 1;

    if($scope.selectedRoomTypes.indexOf(room) == -1) {
      $scope.selectedRoomTypes.push(room);
    };

    $scope.roomSelected = room;
    document.getElementById("reservationWarning").style.visibility = "hidden";
    console.log($scope.roomSelected);
  };

  $scope.removeRoom = function(room){

    if(room.addedCount == 0) return;
    room.addedCount -= 1;
    if(room.addedCount == 0) {
      const index = $scope.selectedRoomTypes.indexOf(room);
      $scope.selectedRoomTypes.splice(index, 1);
    }
  };

  $scope.calculateTotalPrice = function() {
    var totalPrice = 0;
    $scope.selectedRoomTypes.forEach( ({price, addedCount}) => {totalPrice += price * addedCount});
    return totalPrice;
  }
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
