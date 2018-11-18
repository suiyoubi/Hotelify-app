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
  .controller('reservationController', function ($scope, $http, $rootScope, $mdDialog, $location) {
    $scope.initHotelInfo = function () {

      $scope.hotels = $rootScope.reservation.hotels;
      $scope.hotels.forEach(function (value) {
        if (value.address_id != null) {
          value.address = value.street + ", " + value.city + ", " + value.province + ", " + value.country;
        }
      });
    };

    $scope.backToQuickBook = function() {
      $location.path('/quick-book');
    };

    $scope.hotelDetail = function (hotel) {

      //retrieve the photo first
      const storage = firebase.storage();
      const storageRef = storage.ref(`${hotel.id}/image.png`);

      storageRef.getDownloadURL().then(function (url) {
        $scope.imageUrl = url;

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
      $scope.checkin_date = $rootScope.reservation.checkin_date;
      $scope.checkout_date = $rootScope.reservation.checkout_date;

      $scope.nights = $rootScope.reservation.nights;
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

      const hotelTagUrl = `${$rootScope.url}/tags/hotel/${hotel.id}`;

      $http.get(hotelTagUrl).then(function (res) {
        console.log(res);
        $scope.tags = res.data;
      }, function (err) {
        console.error(err);
      });

      //get reviews
      const reviewUrl = `${$rootScope.url}/reviews/hotel/${hotel.id}`;
      $http({
        url: reviewUrl,
        method: "GET"
      }).then(function (res) {
        $scope.reviews = res.data;
      }, function (err) {
        // handle error here
        console.log(err);
      });

      // get yelp review
      const yelpUrl = `${$rootScope.url}/reviews/yelp/hotel/${hotel.id}`;
      $http({
        url: yelpUrl,
        method: "GET"
      }).then(function (res) {
        $scope.yelpReviews = res.data.reviews;
        console.log($scope.yelpReviews);
      }, function (err) {
        // handle error here
        console.log(err);
      });


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

    $scope.sendServationSequenceRequest = function() {

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
            console.error('create reservation failed', err);
          });
        });
      }, function (err) {
        console.error(err);
      })

      $mdDialog.show(
        $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('Success')
          .textContent('Your reservation has been processed!')
          .ok('OK')
      );
    };
    $scope.makeReservation = function () {

      if($scope.selectedRoomTypes.length == 0) {
        document.getElementById("reservationWarning").style.visibility = "visible";
        return;
      }

      var confirm = $mdDialog.confirm()
        .title('Would you like to make your reservation?')
        .textContent('You can change your reservation details later as well')
        .ok('Confirm')
        .cancel('Let Me Double Check');

      $mdDialog.show(confirm).then(function() {

        $scope.sendServationSequenceRequest();
      });

    };

    $scope.addRoom = function (room) {

      if (room.addedCount == room.count) return;
      room.addedCount += 1;

      if ($scope.selectedRoomTypes.indexOf(room) == -1) {
        $scope.selectedRoomTypes.push(room);
      }
      document.getElementById("reservationWarning").style.visibility = "hidden";
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
        totalPrice += price * addedCount * $scope.nights;
      });
      return totalPrice;
    }
    $scope.cancel = function () {
      console.log('cancel');
      $mdDialog.cancel();
    };
  });
