'use strict';

angular.module('myApp.register', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/register', {
    templateUrl: 'register/register.html',
    controller: 'RegisterCtrl'
  });
}])

.controller('RegisterCtrl', function($scope, $location, $rootScope, $http, $mdDialog) {

  $scope.registerCustomer = () => {
    const { username, password, last_name, first_name, repeatPassword, email, phone_number } = $scope;
    const { popUp, url } = $rootScope;

    if(!username || !password || !email) {
      popUp("Your inputs are not complete!");

      return;
    }

    if(password !== repeatPassword) {
      popUp("Your password does not pair!");

      return;
    }

    const user = {
      username,
      password,
      last_name,
      first_name,
      email,
      phone_number,
    };

    console.log(user);
    const registerUtl = url + '/customers/signup';

    $http.post(registerUtl, user).then((res) => {
      popUp('Successfully created the account!', 'Nice');

      $location.path('/login');
    }, (err) => {
      // TODO: handle different err response
      popUp('Registeration failed. Try again later');
    });
  };
});
