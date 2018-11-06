'use strict';

angular.module('myApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'loginController'
  });
}])

.controller('loginController', function($scope, $location, $rootScope, $http) {

  $scope.jumpToRegister = () => {
      $location.path('/register');
  };

  $scope.checkboxModel = 'customer';

  $scope.loginAuth = () => {

    const { username, password, checkboxModel } = $scope;
    const { url, popUp } = $rootScope;

    if(!username || !password) {
      popUp('Please input both username and password');
      return;
    }

    const loginUrl = url + '/' + checkboxModel + 's/login';

    console.log(loginUrl);

    const authData = {username, password};

    $http.post(loginUrl, authData)
        .then((res) => {
          // TODO: handle customer/admin
          console.error(res);

          $location.path('/dashboard');

          $rootScope.userType = res.data.userType;
          $rootScope.username = username;
        }, (res) => {
          popUp('Your credential is incorrect, please try again.');
        });
  };
});
