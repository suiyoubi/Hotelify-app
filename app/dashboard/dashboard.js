'use strict';

angular.module('myApp.dashboard', [
  'ngMaterial',
  'ngMessages',
  'ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/dashboard', {
      templateUrl: 'dashboard/dashboard.html',
      controller: 'dsController'
    }).when('/page4', {
      templateUrl: 'dashboard/component/1.html',
      controller: 'dsController'
    });
  }])
  .controller('navController', function ($scope, $location, $rootScope) {

    $scope.currentNavItem = $rootScope.nextNavItem;
    if($rootScope.userType == 'customer') {
      $scope.navItems = [
        {value: "hotelify", label: "Hotelify"},
        {value: "quick-book", label: "Quick Book", icon: "date_range"},
        {value: "account-info", label: "Account Info", icon: "account_box"},
        {value: "book-history", label: "Book History", icon: "history"},
        {value: "logout", label: "logout", icon: "exit_to_app"},
      ];
    } else if($rootScope.userType == 'administrator') {
      $scope.navItems = [
        {value: "browse-hotels", label: "Browse", icon: "hotel"},
        {value: "hotelify", label: "Hotelify"},
        {value: 'addHotel', label: 'add hotel', icon: "library_add"},
        {value: 'hotelManagement', label: 'hotel management', icon: "explore"},
        {value: 'coupon', label:'Distribute Coupon', icon: "attach_money"},
        {value: "logout", label: "logout", icon: "exit_to_app"},
      ];
    } else {
      $location.path('/login');
    }

    $scope.goto = function (page) {

      $rootScope.nextNavItem = page;
      //if(page == 'hotelify') $location.path('/dashboard');
      if(page == 'browse-hotels') $location.path('/browse');
      if(page == 'account-info') $location.path('/account-info');
      if(page == 'quick-book') $location.path('/quick-book');
      if(page == 'logout') $location.path('/login');
      if(page == 'addHotel') $location.path('/add_hotel');
      if(page == 'hotelManagement') $location.path('/hotel_management');
      if(page == 'book-history') $location.path('history');
      if(page == 'coupon') $location.path('/coupon');
    };
  })
   .controller('dsController', function ($scope, $http, $rootScope, $location) {

     // Light-weight coupon type eager fetch here.
     const couponTypeUrl = `${$rootScope.url}/coupon-types`;

     $http.get(couponTypeUrl).then(function (res) {
       $rootScope.couponTypes = res.data;
     }, function (err) {
       console.error(err);
     });


     // if($rootScope.userType=='customer') {
     //   $location.path('/quick-book');
     // } else if($rootScope.userType == 'administrator') {
     //   $location.path('/account-info');
     // } else {
     //   $location.path('login');
     // }
   });
