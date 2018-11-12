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
    const updateUrl = `${url}/${userType}s/update`;
    $scope.addressUrl = `${url}/addresses`;
    $scope.address = {street:"", city:"", province:"", postal_code:"", country:""};

    $scope.isCustomer = function () {
      return userType == 'customer' ? true : false;
    };

    $scope.retrieveUserInfo = function () {

      // get user info
      $http.get(userInfoUrl).then((res) => {
        console.log(res);

        $scope.user = res.data;
      // if user have address, get it
      if($scope.user.address_id!=null){
        var getAddressUrl = $scope.addressUrl + "/" + $scope.user.address_id;
        $http.get(getAddressUrl).then((res) => {
          console.log(res.data);
        $scope.address = res.data;

      }, (res) => {
          popUp('Looks like you hacked into this page, please go back and log in');
          $location.path('/login');
        });
      }
      }, (res) => {
        popUp('Looks like you hacked into this page, please go back and log in');
        $location.path('/login');
      });

    };

    $scope.updateUserInfo = () => {
      console.log($scope.address);

      if($scope.user.address_id==null){
        //no address associated
        var targetUrl = $scope.addressUrl + "/create";
        $http.post(targetUrl, $scope.address).then((res) => {
          console.log('create address sucess');
          $scope.user.address_id = parseInt(res.data.id);
      }, (err) => {
          console.error('error creating address');
        });
      }else {
        var targetUrl = $scope.addressUrl + "/update";
        $scope.address.id = $scope.user.address_id;
        $http.put(targetUrl, $scope.address).then((res) => {
          console.log('sucess');
          console.log('update address success');
      }, (err) => {
          console.error('error updating address');
        });
      }

      // update user info
      console.log($scope.user);
      $http.put(updateUrl, $scope.user).then((res) => {
        console.log('update user info success');
      }, (err) => {
        console.error('error updating user info');
      });
    };
  })
  .config(function ($mdThemingProvider) {

    // Configure a dark theme with primary foreground yellow

    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('yellow')
      .dark();

  });
