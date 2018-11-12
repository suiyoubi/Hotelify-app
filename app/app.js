'use strict';

// Declare app level module which depends on views, and core components
var app = angular.module('myApp', [
  'ngMaterial',
  'ngRoute',
  'myApp.login',
  'myApp.register',
  'myApp.dashboard',
  'myApp.version',
  'myApp.browse',
  'myApp.quickBook',
  'myApp.accountInfo',
  'myApp.reviews',
  'myApp.history',
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/login'});
}]).
run(function($rootScope, $mdDialog) {
  $rootScope.url = 'http://localhost:8080';
  $rootScope.popUp = function(content = "Something went wrong...", title = 'Oops', confirmMessage = 'Okay') {
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title(title)
        .textContent(content)
        .ariaLabel('Alert Dialog Demo')
        .ok(confirmMessage)
    );
  };
});
