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
.controller('historyController', function ($scope, $http, $rootScope, $mdDialog) {
  var username = $rootScope.username;
  console.log(username);
  //$http.get
  var history = [
      //hotelName = 'brandName'+'-branchName'
    {hotelId:1, hotelName:"jingrui hotel-xixi", checkinDate:"some date", checkoutDate:"some date", price:300},
    {hotelId:2, hotelName:"Hyatt-UBC", checkinDate:"some date", checkoutDate:"some date", price:500}
  ];

  $scope.history = history;

  $scope.leaveReview = function(hotelId) {
    $mdDialog.show({
      controller: 'leaveReviewController',
      templateUrl: 'leaveReview.tmpl.html',
      parent: angular.element(document.body),
      clickOutsideToClose:true,
      locals:{ hotelId },
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    });
  };
})
.controller('leaveReviewController', function ($scope, $mdDialog, $http, hotelId) {
  $scope.id = hotelId;
  this.comment = "";
  this.rating = -1;
  this.tag = "";

  $scope.cancel = function(){
    $mdDialog.cancel();
  };

  $scope.submit = function () {
    //$http.post
    if($scope.rating==undefined){
      $rootScope.popUp("come on at least put a rating");
      return;
    }
    console.log($scope.id);
    console.log($scope.comment);
    console.log($scope.rating);
    console.log($scope.tag);
  }
})
;