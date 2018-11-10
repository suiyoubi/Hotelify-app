'use strict';

angular.module('myApp.accountInfo', [
  'ngMaterial',
  'ngMessages',
  'ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/account-info', {
      templateUrl: 'account_info/account-info.html',
      controller: 'accInfoController'
    });
  }])
  .controller('accInfoController', function ($scope, $http, $rootScope, $location) {
    const {username, popUp} = $rootScope;

    const {url, userType} = $rootScope;
    const userInfoUrl = `${url}/${userType}s/${username}`;

    $scope.isCustomer = function () {
      return userType == 'customer' ? true : false;
    };

    $scope.retrieveUserInfo = function () {

      $http.get(userInfoUrl).then((res) => {
        console.error(res);

        $scope.user = res.data;
      }, (res) => {
        popUp('Looks like you hacked into this page, please go back and log in');
        $location.path('/login');
      });
    };

    $scope.updateUserInfo = () => {
      console.error($scope.user);

      $http.put(userInfoUrl).then((res) => {
        console.error('sucess');
      }, (err) => {
        console.error('error');
      });
    };
  })
  .config(function ($mdThemingProvider) {

    // Configure a dark theme with primary foreground yellow

    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('yellow')
      .dark();

  });
