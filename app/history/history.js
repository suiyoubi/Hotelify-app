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
        console.log(username);
        // get all reservation of a customer
        var url = $rootScope.url + "/reservations/customer/"
            + $rootScope.username;
        $http({
          url: url,
          method: "GET"
        }).then(function (res) {
          console.log(res);
          $scope.history = res.data;
          $scope.history.forEach(function (value) {
            // get reservation status
            if (value.payment_id != null && new Date(value.checkout_date)<new Date()) {
              value.status = "finished";
            } else if (value.payment_id != null) {
              value.status = "paid";
            } else {
              value.status = "payment pending";
            }

            // get hotel info (hotel name...)
            var hotelNameUrl = $rootScope.url + "/hotels/" + value.hotel_id;
            $http({
              url: hotelNameUrl,
              method: "GET"
            }).then(function (res) {
              value.hotelInfo = res.data;
            }, function (err) {
              console.log(err);
            });
          })
        }, function (err) {
          console.log(err);
        });
      };

      $scope.leaveReview = function (reservation) {
        if (reservation.status == "payment pending") {
          // todo:go to payment
          console.log("payment pending");
        } else if (reservation.status == "paid") {
          // paid, not finished trip yet
          console.log("paid");
        }
        else {
          // finished trip
          $mdDialog.show({
            controller: 'leaveReviewController',
            templateUrl: 'leaveReview.tmpl.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {reservation},
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
          });
        }
      };
    })
.controller('leaveReviewController',
    function ($rootScope, $scope, $mdDialog, $http, reservation) {
      $scope.hotel_id = reservation.hotel_id; // todo: check format
      this.comment = "";
      this.rating = -1;
      this.tag = "";

      $scope.retrieveTag = function () {
        // get all tags of this hotel
        var url = $rootScope.url + "/tags/hotel/" + reservation.hotel_id;
        $http({
          url: url,
          method: "GET"
        }).then(function (res) {
          console.log(res);
          $scope.currentTags = res.data;
          $scope.displayTags = [];
          var cycle = $scope.currentTags.length > 3 ? 3
              : $scope.currentTags.length;
          for (var i = 0; i < cycle; i++) {
            $scope.displayTags[i] = $scope.currentTags[i].tag_name;
          }
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

        var reviewUrl = $rootScope.url + "/reviews/create";
        var reviewRequest = {
          username: $rootScope.username,
          hotel_id: reservation.hotel_id,
          rating: parseInt($scope.rating),
          comment: $scope.comment
        };

        console.log(reviewRequest);
        $http({
          url: reviewUrl,
          method: "POST",
          params: reviewRequest
        }).then(function (res) {
          console.log(res);
        }, function (err) {
          console.log(err);
        });

        // check if user provides a tag
        if ($scope.tag == undefined) {
          console.log("didn't add any new tag");
          return;
        }

        // check if this tag already exists
        var isNewTag = true;
        var targetTag = {};
        for (var item in $scope.currentTags) {
          if ($scope.currentTags[item].tag_name == $scope.tag) {
            isNewTag = false;
            targetTag = $scope.currentTags[item];
            break;
          }
        }

        if (isNewTag) {
          // $http.post
          var url = $rootScope.url + "/tags/create";
          var request = {
            hotel_id: $scope.hotel_id,
            tag_name: $scope.tag,
            popularity: 1
          };
          console.log(request);
          console.log($scope.displayTags);
          $http({
            url: url,
            method: "POST",
            params: request
          }).then(function (res) {
            console.log(res);
          }, function (err) {
            console.log(err);
          });
        } else {
          // if the tag already exists, update its popularity
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
        }

        $rootScope.popUp("thank you for your review!", "success");
      }
    })
;