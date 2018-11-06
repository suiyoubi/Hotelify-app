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
    const { username, password, lastName, firstName, repeatPassword, email } = $scope;
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
      lastName,
      firstName,
      email,
    };

    const registerUtl = url + '/customers';

    $http.post(registerUtl, user).then((res) => {
      $scope.showConfirm = function(ev) {
        const confirm = $mdDialog.confirm()
          .title('Succeess')
          .textContent(`You have already created your hotelify account as ${username}`)
          .targetEvent(ev)
          .ok('Excellent');

        $mdDialog.show(confirm).then(function() {
          $location.path('/login');
        });
      };
    }, (err) => {
      popUp('Registeration failed. Try again later');
    });
  };

});
