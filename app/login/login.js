'use strict';

angular.module('myApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'loginController'
  });
}])

.controller('loginController', function($scope, $location, $rootScope, $http) {
  $scope.submitThis = function() {
    let username = $scope.username;
    let password = $scope.password;
    let url = $rootScope.url;

    console.log(username + ':' + password);
    $http.get(url+'/customers')
        .then(function(res) {
          console.log(res);
        }, function(res) {
          console.log('rinima'+res);
        });

    if(username == 'admin' && password == 'admin') {
      $location.path('/view2');
    }
  };
});
