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
    $scope.initHotelInfo = function () {

      $rootScope.popUp(`Hotelify has found ${$rootScope.reservation.hotels.length} hotels that satisfy your need!`, 'Awesome');

      $scope.hotels = $rootScope.reservation.hotels;
      $scope.hotels.forEach(function (value) {
        if (value.address_id != null) {
          value.address = value.street + ", " + value.city + ", " + value.province;
        }
      });
      console.log($scope.hotels);
    };

    $scope.hotelDetail = function (hotel) {

      //retrieve the photo first
      const storage = firebase.storage();
      const storageRef = storage.ref(`${hotel.id}/image.png`);

      storageRef.getDownloadURL().then(function (url) {
        $scope.imageUrl = url;
        console.log(url);

        $mdDialog.show({
          controller: 'makeReservationController',
          templateUrl: 'makeReservation.tmpl.html',
          parent: angular.element(document.body),
          clickOutsideToClose: true,
          locals: {hotel, url},
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        });

      }, function (err) {

        console.error('no image found');
        $mdDialog.show({
          controller: 'makeReservationController',
          templateUrl: 'makeReservation.tmpl.html',
          parent: angular.element(document.body),
          clickOutsideToClose: true,
          locals: {hotel, url: null},
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        });
      });

    };

  })
  .controller('makeReservationController', function ($scope, $mdDialog, $http, $rootScope, hotel, url) {
    $scope.initRoomInfo = function () {
      //init room info
      $scope.roomType = {};
      $scope.displayTags = [];
      $scope.url = url;

      const hotelRoomsAvaUrl = `${$rootScope.url}/hotels/${hotel.id}/availabilities`;

      $http.get(hotelRoomsAvaUrl, {
        params: {
          checkin_date: $rootScope.reservation.checkin_date,
          checkout_date: $rootScope.reservation.checkout_date,
        },
      }).then(function (res) {

        const availableRoom = res.data;

        availableRoom.forEach(function (value) {
          if ($scope.roomType[value.room_type_id] == undefined) {
            $scope.roomType[value.room_type_id] = value;
            $scope.roomType[value.room_type_id].count = 1;
            $scope.roomType[value.room_type_id].addedCount = 0;
            $scope.roomType[value.room_type_id].rooms = [value.id];
          } else {
            $scope.roomType[value.room_type_id].count += 1;
            $scope.roomType[value.room_type_id].rooms.push(value.id);
          }
        });
      }, function (err) {
        console.error(err);
      });


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

    $scope.roomSelected = {};
    $scope.selectedRoomTypes = [];
    $scope.hotelInfo = hotel;

    $scope.findAllRoomsForReservation = function() {

      var rooms = [];
      $scope.selectedRoomTypes.forEach( ({room_type_id}) => {
        $scope.roomType[room_type_id].rooms.slice(0, $scope.roomType[room_type_id].addedCount).forEach((e) => rooms.push(e));
      });

      return {
        firstRoom: rooms[0],
        restRooms: rooms.slice(1),
      };
    };

    $scope.makeReservation = function () {

      const {firstRoom, restRooms} = $scope.findAllRoomsForReservation();

      const reservationUrl = `${$rootScope.url}/reservations/create`;

      const postBody = {
        username: $rootScope.username,
        room_id: firstRoom,
        checkin_date: $rootScope.reservation.checkin_date,
        checkout_date: $rootScope.reservation.checkout_date,
      };

      //First Post
      $http.post(reservationUrl, postBody).then(function (res) {
        //get the reservation id
        const id = res.data.id;

        restRooms.forEach( (room_id) => {
          const sequencePostBody = {
            id,
            username: $rootScope.username,
            room_id,
            checkin_date: $rootScope.reservation.checkin_date,
            checkout_date: $rootScope.reservation.checkout_date,
          };

          $http.post(reservationUrl, sequencePostBody).then(function (res) {
            console.log('part-reservation finished');
          }, function (err) {
            console.error('create reservation failed');
          });
        });
      }, function (err) {
        console.error(err);
      })

      $mdDialog.show(
        $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('Success')
          .textContent('Your reservation has been proceed!')
          .ok('OK')
      )
    };

    $scope.addRoom = function (room) {

      if (room.addedCount == room.count) return;
      room.addedCount += 1;

      if ($scope.selectedRoomTypes.indexOf(room) == -1) {
        $scope.selectedRoomTypes.push(room);
      }
      ;

      $scope.roomSelected = room;
      document.getElementById("reservationWarning").style.visibility = "hidden";
      console.log($scope.roomSelected);
    };

    $scope.removeRoom = function (room) {

      if (room.addedCount == 0) return;
      room.addedCount -= 1;
      if (room.addedCount == 0) {
        const index = $scope.selectedRoomTypes.indexOf(room);
        $scope.selectedRoomTypes.splice(index, 1);
      }
    };

    $scope.calculateTotalPrice = function () {
      var totalPrice = 0;
      $scope.selectedRoomTypes.forEach(({price, addedCount}) => {
        totalPrice += price * addedCount
      });
      return totalPrice;
    }
    $scope.cancel = function () {
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

    $scope.isIndeterminate = function () {
      return ($scope.selected.length !== 0 &&
        $scope.selected.length !== $scope.roomType.length);
    };

    $scope.isChecked = function () {
      return $scope.selected.length === $scope.roomType.length;
    };
  });
