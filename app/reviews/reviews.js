'use strict';

angular.module('myApp.reviews', [
  'ngMaterial',
  'ngMessages',
  'ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/reviews', {
      templateUrl: 'reviews/reviews.html',
      //controller: 'reviewsController'
    });
  }])
  .controller('reviewsController', function ($scope, $http, $rootScope, $location) {

    $scope.rowCollection = [
      {id: 1, branchName: 'haus hotel', brandName: 'haohao', address: 'fake add 1'},
      {id: 2, branchName: 'kanglong hotel', brandName: 'haohao', address: 'fake add 2'},
      {id: 3, branchName: 'rex hotel', brandName: 'xixi', address: 'fake add 3'},
      {id: 4, branchName: 'jingrui hotel', brandName: 'xixi', address: 'add 4'},
    ];

    $scope.rawList = [
      {
        name: 'haus',
        info: 'Secondary line text Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam.\n' +
          '          Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum\n' +
          '          velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.'
      },
      {
        name: 'scott',
        info: 'Secondary line text Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam.\n' +
          '          Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum\n' +
          '          velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.'
      },
    ]

    $scope.searchHotel = function () {

      // GET api/hotels/
      const url = `${$rootScope.url}/api/hotels`;
      $http.get(url, {
        params: { user_id: user.id }
      }).then(function () {

        //todo: display all the hotel into the list
      });
    };

    $scope.addnewstuff = function () {
      $scope.rawList.push({
        name: 'haus',
        info: 'Secondary line text Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam.\n' +
          '          Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum\n' +
          '          velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.'
      });
    }

    $scope.selectedRow = $scope.rowCollection[1];
    $scope.changeReviews = function (row) {

      console.error(row);
      $scope.selectedRow = row;

      // GET api/hotels/{hotelId}/reviews
      // const url = `${$rootScope.url}/api/hotels/${row.id}/reviews/`;
      // $http.get(url).then(function () {
      //   // todo: display the new review list;
      // });
    };
  });
