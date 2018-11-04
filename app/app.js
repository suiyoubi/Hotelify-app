'use strict';

// Declare app level module which depends on views, and core components
var app = angular.module('myApp', [
  'ngRoute',
  'myApp.login',
  'myApp.view2',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/login'});
}]).
run(function($rootScope) {
    $rootScope.url = 'http://localhost:8080';
});
