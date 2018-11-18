'use strict';

angular.module('myApp.history', [
  'ngMaterial',
  'ngMessages',
  'ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/history', {
      templateUrl: 'history/history.html',
      controller: 'historyController'
    });
  }])
  .controller('historyController',
    function ($scope, $http, $rootScope, $mdDialog) {

      $scope.history = [];
      $scope.initHistory = function () {
        var username = $rootScope.username;
        // get all reservation of a customer
        var url = $rootScope.url + "/reservations/customer/"
          + $rootScope.username;
        $http({
          url: url,
          method: "GET"
        }).then(function (res) {
          console.log(res);
          $scope.allReservation = res.data;
          $scope.allReservation.forEach(function (value) {
            // get reservation status
            if (value.payment_id != null && new Date(value.checkout_date) < new Date()) {
              value.status = "finished";
            } else if (value.payment_id != null) {
              value.status = "paid";
            } else {
              value.status = "payment pending";
            }
          });

          $scope.refreshThreeLists();
        }, function (err) {
          console.log(err);
        });
      };

      $scope.refreshThreeLists = function () {
        $scope.pendingReservationRooms = [];
        $scope.upcomingReservationRooms = [];
        $scope.historyReservationRooms = [];
        // cat into three tables
        $scope.allReservation.forEach(function (r) {
          if (r.status == 'finished') $scope.historyReservationRooms.push(r);
          if (r.status == 'paid') $scope.upcomingReservationRooms.push(r);
          if (r.status == 'payment pending') $scope.pendingReservationRooms.push(r);
        });

        var groupBy = function (xs, key) {
          return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
          }, {});
        };
        $scope.pendingReservations = Object.values(groupBy($scope.pendingReservationRooms, 'id'));
        $scope.upcomingReservations = Object.values(groupBy($scope.upcomingReservationRooms, 'id'));
        $scope.historyReservations = Object.values(groupBy($scope.historyReservationRooms, 'id'));

        $scope.paidPrice = {};
        $scope.upcomingReservations.forEach(r => {
          const payment_id = r[0].payment_id;
          $http.get(`${$rootScope.url}/payments/${payment_id}`).then(function (res) {
            $scope.paidPrice[r[0].id] = res.data.amount;
          }, function (err) {
            console.error(err);
          });
        });
        $scope.historyReservations.forEach(r => {
          const payment_id = r[0].payment_id;
          $http.get(`${$rootScope.url}/payments/${payment_id}`).then(function (res) {
            $scope.paidPrice[r[0].id] = res.data.amount;
          }, function (err) {
            console.error(err);
          });
        });
      };

      $scope.calculatePrice = function (reservation) {
        var totalPrice = 0;
        const nights = (new Date(reservation[0].checkout_date) - new Date(reservation[0].checkin_date)) / (1000 * 60 * 60 * 24);
        reservation.forEach(r => {
          totalPrice += Number(r.price) * nights;
        });
        return totalPrice;
      };

      $scope.paymentSubPage = function (reservation) {

        $mdDialog.show({
          controller: 'paymentController',
          templateUrl: 'payment.tmpl.html',
          parent: angular.element(document.body),
          clickOutsideToClose: true,
          locals: {reservation, reservationId: reservation[0].id},
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        }).then(function () {
          $scope.initHistory();
        }, function () {
          $scope.initHistory();
        });
      }
      $scope.showReservation = function (reservation) {
        $mdDialog.show({
          controller: 'showReservationController',
          templateUrl: 'showReservation.tmpl.html',
          parent: angular.element(document.body),
          clickOutsideToClose: true,
          locals: {
            reservation,
            paymentId: reservation[0].payment_id,
            startDate: reservation[0].checkin_date,
            endDate: reservation[0].checkout_date,
          },
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        });
      };
      $scope.leaveReview = function (reservation) {
        // finished trip
        $mdDialog.show({
          controller: 'leaveReviewController',
          templateUrl: 'leaveReview.tmpl.html',
          parent: angular.element(document.body),
          clickOutsideToClose: true,
          locals: {reservation},
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        });

      };
    })
  .controller('showReservationController', function ($rootScope, $scope, $http, $mdDialog, reservation, paymentId, startDate, endDate) {

    $scope.startDate = startDate;
    $scope.endDate = endDate;
    $scope.roomType = {};

    const availableRoom = reservation;
    console.log(availableRoom);

    $scope.nights = (new Date(availableRoom[0].checkout_date) - new Date(availableRoom[0].checkin_date)) / (1000 * 60 * 60 * 24);
    availableRoom.forEach(function (value) {

      if ($scope.roomType[value.room_type_id] == undefined) {
        $scope.roomType[value.room_type_id] = value;
        $scope.roomType[value.room_type_id].count = 1;
      } else {
        $scope.roomType[value.room_type_id].count += 1;
      }
    });

    $http.get(`${$rootScope.url}/payments/${paymentId}`).then(function (res) {
      $scope.payment = res.data;
    }, function (err) {
      console.error(err);
    })
  })
  .controller('paymentController', function ($rootScope, $scope, $http, $mdDialog, reservation, reservationId) {

    $scope.cancelReservation = function () {

      const confirm = $mdDialog.confirm()
        .title('Are you sure')
        .textContent('Your reservation will be cancelled and the rooms will not be reserved for you')
        .ok('Confirm')
        .cancel('I change my mind');

      $mdDialog.show(confirm).then(function(){

        const cancelReservationURl = `${$rootScope.url}/reservations/delete/${reservationId}`;

        $http.delete(cancelReservationURl).then(function (res) {
          $rootScope.popUp('You have cancelled your reservation.', 'Success');
        });
      });
    };
    $scope.makePayment = function () {
      if (!$scope.selectedCard) {
        $rootScope.popUp('You have not selected any card');
        return;
      }

      const paymentUrl = `${$rootScope.url}/payments/reservation/${reservationId}`;
      $http.post(paymentUrl, {
        amount: $scope.calculateTotalPrice(),
        coupon_id: $scope.selectedCoupon ? $scope.selectedCoupon.id : null,
        card_number: $scope.selectedCard.card_number,
      }).then(function (res) {
        //success
        $mdDialog.cancel();
        $rootScope.popUp('You have successfully paid your reservation', 'Excellent');
      }, (function (err) {
        $rootScope.popUp('Your payment dis not go through, please try with another card');
      }));
    }
    $scope.selectCard = function (card) {
      $scope.selectedCard = card;
    }
    $scope.selectCoupon = function (coupon) {
      $scope.selectedCoupon = coupon;
    };
    $scope.calculateDiscountType = function (coupon) {
      if (!coupon) return 'Not Available';
      return `${coupon.value} ${coupon.discount_type} off`;
    };
    $scope.maskCard = function (number) {
      // 1111 2222 3333 4444 to 1111-xxxx-xxxx-4444
      if (!number) return `XXXX-XXXX-XXXX-XXXX`;
      return `${number.substring(0, 4)}-XXXX-XXXX-${number.substring(12, 16)}`;
    };
    $scope.calculateTotalPrice = function () {
      let beforeCouponPrice = 0;
      reservation.forEach(function (room) {
        beforeCouponPrice += room.price * $scope.nights;
      });
      if ($scope.selectedCoupon) {
        if ($scope.selectedCoupon.discount_type == '$') {
          return (beforeCouponPrice - $scope.selectedCoupon.value) > 0 ? (beforeCouponPrice - $scope.selectedCoupon.value) : 0;
        } else {
          return beforeCouponPrice * 0.1 / 10 * (100 - $scope.selectedCoupon.value);
        }
      }
      return beforeCouponPrice;
    };

    const availableRoom = reservation;
    $scope.allRooms = reservation;

    $http.get(`${$rootScope.url}/cards/customer/${$rootScope.username}`).then(function (res) {
      $scope.cards = res.data;
    }, function (err) {
      console.error(err);
    });
    $http.get(`${$rootScope.url}/coupons/customer/${$rootScope.username}/hotel/${availableRoom[0].hotel_id}`).then(function (res) {
      $scope.coupons = res.data;
    }, function (err) {
      console.error(err);
    });

    $scope.roomType = {};

    console.log(availableRoom);

    $scope.nights = (new Date(availableRoom[0].checkout_date) - new Date(availableRoom[0].checkin_date)) / (1000 * 60 * 60 * 24);
    availableRoom.forEach(function (value) {

      if ($scope.roomType[value.room_type_id] == undefined) {
        $scope.roomType[value.room_type_id] = value;
        $scope.roomType[value.room_type_id].count = 1;
        $scope.roomType[value.room_type_id].addedCount = 0;
        //$scope.roomType[value.room_type_id].nights = (new Date(value.checkout_date) - new Date(value.checkin_date)) / (1000*60*60*24);
      } else {
        $scope.roomType[value.room_type_id].count += 1;
      }
    });
  })
  .controller('leaveReviewController',
    function ($rootScope, $scope, $mdDialog, $http, reservation) {
      $scope.hotel_id = reservation[0].hotel_id;
      console.log('hotel_id:' + $scope.hotel_id);
      this.comment = "";
      this.rating = -1;
      this.tag = "";

      $scope.tagHash = {};
      $scope.clickOnTag = function (tag) {
        console.error(tag);
        tag.isExistTag = true;
        if ($scope.selectedTags.indexOf(tag.tag_name) == -1) {
          $scope.selectedTags.push(tag.tag_name);
          $scope.tagHash[tag.tag_name] = tag.popularity;
        }
      };
      $scope.selectedTags = [];
      $scope.retrieveTag = function () {
        // get all tags of this hotel
        var url = $rootScope.url + "/tags/hotel/" + reservation[0].hotel_id;
        console.log(url);
        $http({
          url: url,
          method: "GET"
        }).then(function (res) {
          console.log(res);
          $scope.displayTags = res.data;
          console.log($scope.displayTags);
        }, function (err) {
          // handle error here
          console.log(err);
        });

      };

      $scope.onModelChange = function ($chip) {
        // update popular tags
        var targetTag;
        for (var i = 0; i < $scope.currentTags.length; i++) {
          if ($scope.currentTags[i].tag_name == $chip) {
            targetTag = $scope.currentTags[i];
            break;
          }
        }
        targetTag.popularity = parseInt(targetTag.popularity) + 1;
        var url = $rootScope.url + "/tags/update";
        var request = {
          hotel_id: $scope.hotel_id,
          tag_name: targetTag.tag_name,
          popularity: targetTag.popularity
        };
        console.log("put " + request);
        $http({
          url: url,
          method: "PUT",
          params: request
        }).then(function (res) {
          console.log(res);
        }, function (err) {
          console.log(err);
        });

      };

      $scope.cancel = function () {
        $mdDialog.cancel();
      };

      $scope.submit = function () {
        //$http.post
        // todo: connect with db
        if ($scope.rating == undefined || $scope.comment == undefined) {
          document.getElementById(
            "reservationWarning").style.visibility = "visible";
          return;
        }

        const reviewUrl = $rootScope.url + "/reviews/create";
        const reviewRequest = {
          username: $rootScope.username,
          hotel_id: reservation[0].hotel_id,
          rating: parseInt($scope.rating),
          comment: $scope.comment
        };
        $http({
          url: reviewUrl,
          method: "POST",
          params: reviewRequest
        }).then(function (res) {
          console.log(res);
        }, function (err) {
          console.error(err);
        });

        $scope.selectedTags.forEach(tag_name => {
          if ($scope.tagHash[tag_name]) {
            // if the tag already exists, update its popularity
            var url = $rootScope.url + "/tags/update";
            var request = {
              hotel_id: $scope.hotel_id,
              tag_name: tag_name,
              popularity: 1 + Number($scope.tagHash[tag_name])
            };
            $http({
              url: url,
              method: "PUT",
              params: request
            }).then(function (res) {
              console.log(res);
            }, function (err) {
              console.log(err);
            });
          } else {
            var url = $rootScope.url + "/tags/create";
            var request = {
              hotel_id: $scope.hotel_id,
              tag_name: tag_name,
              popularity: 1
            };
            $http({
              url: url,
              method: "POST",
              params: request
            }).then(function (res) {
              console.log(res);
            }, function (err) {
              console.log(err);
            });
          }
        });

        $rootScope.popUp("thank you for your review!", "success");
      };
    });


