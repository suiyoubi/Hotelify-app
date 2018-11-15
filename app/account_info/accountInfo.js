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
  .controller('accInfoController', function ($scope, $http, $rootScope, $location, $mdDialog) {
    const {username, popUp} = $rootScope;

    const {url, userType} = $rootScope;
    const userInfoUrl = `${url}/${userType}s/${username}`;
    const updateUrl = `${url}/${userType}s/update`;
    const getReviewsUrl = `${$rootScope.url}/reviews/username/${username}`;
    $scope.addressUrl = `${url}/addresses`;
    $scope.address = {street:"", city:"", province:"", postal_code:"", country:""};

    $scope.cards = [
      {card_number: '1234123412341234', card_holder_name:'haus', expire_date: '2008/01/01'},
      {card_number: '4444333322221111', card_holder_name:'rex', expire_date: '2088/01/01'},
    ];
    $scope.reviews = [];

    $scope.deleteCard = function(card) {
      const confirm = $mdDialog.confirm()
        .title('Would you like to delete your card?')
        .textContent('Your selected credit card information will be deleted from Hotelify')
        .ok('Confirm')
        .cancel('I change my mind');

      $mdDialog.show(confirm).then(function() {
        console.log('to delete card:', card);
        // todo use DELETE
      });
    }
    $scope.maskCard = function(number) {
      // 1111 2222 3333 4444 to 1111-xxxx-xxxx-4444
      return `${number.substring(0,4)}-XXXX-XXXX-${number.substring(11,15)}`;
    };

    $scope.isCustomer = function () {
      return userType == 'customer' ? true : false;
    };

    $scope.addNewCard = function () {

      const {card_number, card_holder_name, csv, expire_date} = $scope.newCard;

      if(!card_holder_name || !card_number || !csv || !expire_date) {
        $rootScope.popUp('Please provide all information!');
        return;
      }
      if(card_number.length != 16) {
        $rootScope.popUp('Card number is not valid!');
        return;
      }
      if(csv.length != 3) {
        $rootScope.popUp('csv is not valid!');
        return;
      }

      //todo add the POST here
      $rootScope.popUp('You have added your new card info!', 'Great', 'nice');
      $scope.cards.push($scope.newCard);
      $scope.newCard = null;
    }
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

      // todo GET get card info

      //get reviews
      $http.get(getReviewsUrl).then(function (res) {
        $scope.reviews = res.data;
      }, function (err) {
        $rootScope.popUp('Retrieve Reviews failed');
        console.error(err);
      });
    };

    $scope.calculateHotelNumber = function() {
      return $scope.reviews.map((review)=>review.brand_name)
        .filter(function(item, i, ar){ return ar.indexOf(item) === i; }).length;
    }
    $scope.updateUserInfo = () => {
      console.log($scope.address);

      if($scope.user.address_id==null){
        //no address associated
        var targetUrl = $scope.addressUrl + "/create";
        $http.post(targetUrl, $scope.address).then((res) => {
          console.log('create address sucess');
          $scope.user.address_id = parseInt(res.data.id);

        // update user info
        console.log($scope.user);
        $http.put(updateUrl, $scope.user).then((res) => {
          console.log('update user info success');
        }, (err) => {
            console.error('error updating user info');
          });
        }, (err) => {
          console.error('error creating address');
        });
      }else {
        var targetUrl = $scope.addressUrl + "/update";
        $scope.address.id = $scope.user.address_id;
        $http.put(targetUrl, $scope.address).then((res) => {
          console.log('sucess');
          console.log('update address success');

          // update user info
          console.log($scope.user);
          $http.put(updateUrl, $scope.user).then((res) => {
            console.log('update user info success');
          }, (err) => {
            console.error('error updating user info');
          });
        }, (err) => {
          console.error('error updating address');
        });
      }

    };
  })
  .config(function ($mdThemingProvider) {

    // Configure a dark theme with primary foreground yellow

    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('yellow')
      .dark();

  });
