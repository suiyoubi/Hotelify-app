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
  .controller('browseController', function ($scope, $mdDialog) {
    $scope.rowCollection = [
      {branchName: 'haus hotel', brandName: 'haohao', address: 'fake add 1'},
      {branchName: 'kanglong hotel', brandName: 'haohao', address: 'fake add 2'},
      {branchName: 'rex hotel', brandName: 'xixi', address: 'fake add 3'},
      {branchName: 'jingrui hotel', brandName: 'xixi', address: 'add 4'}
    ];

    $scope.hotelDetail = function(hotel) {
      $mdDialog.show({
        controller: 'anotherController',
        templateUrl: 'dialog1.tmpl.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        locals:{ hotel },
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      });
    };

  })
  .controller('anotherController', function ($scope, $mdDialog, hotel) {

    var roomType = ["single", "double", "总统套房"];
    $scope.selected = [];
    this.startDate = new Date();
    this.endDate = new Date();
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

    $scope.toggleAll = function() {
      if ($scope.selected.length === $scope.roomType.length) {
        $scope.selected = [];
      } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
        $scope.selected = $scope.roomType.slice(0);
      }
    };

    $scope.roomType = roomType;
    $scope.hotelInfo = hotel;

    $scope.makeReservation = function(selected, startDate, endDate){
      console.log(selected);
      console.log(startDate,endDate);
    };

    $scope.cancel = function() {
      console.log('cancel');
      $mdDialog.cancel();
    };
  });
