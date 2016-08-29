(function() {
  'use strict';

  angular.module('app.userAccountController', ['app'])
         .controller('app.userAccountController', userAccountController);

  userAccountController.$inject = ['$scope'];

  function userAccountController ($scope) {
      $scope.addCategory = [
        {category: "Books"},
        {category: "Cars"},
        {category: "Electronics"},
        {category: "Furniture"},
        {category: "Jewelry"},
        {category: "Sporting Goods"},
        {category: "Toys+Games"}
      ];

//this removes an item from the database. Only users can delete their own items. Can be placed in the userAccountController instead


    $scope.remove = function(item) {
      $http.delete('/listings/' + item._id).success(function(res) {
        refreshUserListings();
      });
    };

      //reverse of above, it changes status to true, and deletes the 'renter' prop out of the item field. Then it refreshes the userListings. Can be placed in the userAccountController instead.
    $scope.returnItem = function(item){
      item.rentable = true;
      delete item.renter;
      var newItem = item;
      $http({
        method: 'PUT',
        url: '/listings/' + item._id,
        data: newItem
      }).then(refreshUserListings);
    };

    //adds a post to the database, using the person's username grabbed from localStorage. Can be placed in the userAccountController instead
    $scope.addItem = function(post){
      post.email = JSON.parse(window.localStorage.profile).email;
      if($scope.position && $scope.position.lng && $scope.position.lat){
        post.longitude = $scope.position.lng;
        post.latitude = $scope.position.lat;
      }
      $http({
        method:'POST',
        url: '/listings',
        data: post
      }).then(refreshUserListings);
    };

$scope.yourListings = function() {
    //in order to sort by a person's listing, we grab their email address out of the localStorage. It was stored there after the person logged in with OAuth. If OAuth is not used, another method of getting their email must be used, or just set the person's email address in localStorage in the same place and let the existing code stay the same.
      $scope.email = JSON.parse(window.localStorage.profile).email;
      refreshUserListings();
    }

     $scope.goToUserAcc = function() {
      $window.location.href  = $window.location.href + 'userAccount'
    }

    // /again, similar to refresh above, but causes unknown bug when refactor is tried. Can be placed in a shared factory instead of here.
    var refreshUserListings = function() {
      $http({
        method:'GET',
        url: '/listings'
      }).success(function(res) {
        $scope.yourItems = res;
      });
    }
  }


})();