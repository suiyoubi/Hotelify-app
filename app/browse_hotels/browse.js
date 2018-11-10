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
      {branchName: 'jingrui hotel', brandName: 'xixi', address: 'add 4'},
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

    $scope.hotelInfo = hotel;
    console.error('hello'+JSON.stringify(hotel));

    $scope.cancel = function() {
      console.error('123')
      $mdDialog.cancel();
    };
  });
