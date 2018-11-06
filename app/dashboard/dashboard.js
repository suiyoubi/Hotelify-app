'use strict';

angular.module('myApp.dashboard', [
  'ngMaterial',
  'ngMessages',
  'ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/dashboard', {
      templateUrl: 'dashboard/dashboard.html',
      controller: 'dsController'
    });
  }])
  .controller('dsController', function ($scope, $http, $rootScope, $location) {
    const {username, popUp} = $rootScope;

    $scope.currentNavItem = 'page1';

    $scope.retrieveUserInfo = function () {

      const {url} = $rootScope;

      const userInfoUrl = url + '/customers/' + username;

      $http.get(userInfoUrl).then((res) => {
        console.error(res);

        $scope.user = res.data;
      }, (res) => {
        popUp('Looks like you hacked into this page, please go back and log in');
        $location.path('/login');
      });
    };

    $scope.goto = function (page) {
      $scope.status = "Goto " + page;
    };
  })
  .config(function ($mdThemingProvider) {

    // Configure a dark theme with primary foreground yellow

    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('yellow')
      .dark();

  });
