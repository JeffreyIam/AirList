(function() {
  'use strict';

  angular.module('userAccount', ['app'])
         .controller('userAccountController', userAccountController);

  userAccountController.$inject = ['$scope', '$http', '$window','mainFactory', 'SharedFunctions'];

  function userAccountController ($scope, $http, $window, mainFactory, SharedFunctions) {
    $scope.options = [
      {category: "All Departments"},
      {category: "Books"},
      {category: "Cars"},
      {category: "Electronics"},
      {category: "Furniture"},
      {category: "Jewelry"},
      {category: "Sporting Goods"},
      {category: "Toys+Games"}
    ];

      $scope.addCategory = [
        {category: "Books"},
        {category: "Cars"},
        {category: "Electronics"},
        {category: "Furniture"},
        {category: "Jewelry"},
        {category: "Sporting Goods"},
        {category: "Toys+Games"}
      ];

  $scope.returnItem = returnItem;
  $scope.addItem = addItem;
  $scope.yourListings = yourListings;
  $scope.goToUserAcc = goToUserAcc;
  $scope.sendEmail = sendEmail;
  $scope.refreshUserListings = refreshUserListings;
  $scope.remove = remove;
  $scope.refresh = refresh;
  $scope.logout = SharedFunctions.logout;
  $scope.search = search;
  // $scope.refresh = refresh;

//this removes an item from the database. Only users can delete their own items. Can be placed in the userAccountController instead


    function remove(item) {
      $http.delete('/listings/' + item._id).success(function(res) {
        refreshUserListings();
      });
    };

    function refresh(){
      mainFactory.refreshed().then(function(res){
        $scope.lists = res.data;
      });
    }

    function search(category){
      if(category === "All Departments") {
        $http({
          method:'GET',
          url: '/listings'
        }).success(function(res) {
          $scope.query = res;
        });
      } else {
        $http({
          method:'GET',
          url: '/listings/category/' + category
        }).success(function(res) {
          $scope.query = res;
        });
      }
    };

      //reverse of above, it changes status to true, and deletes the 'renter' prop out of the item field. Then it refreshes the userListings. Can be placed in the userAccountController instead.
    function returnItem(item){
      item.rentable = true;
      delete item.renter;
      var newItem = item;
      $http({
        method: 'PUT',
        url: '/listings/' + item._id,
        data: newItem
      }).then($scope.refreshUserListings);
    };

    //adds a post to the database, using the person's username grabbed from localStorage. Can be placed in the userAccountController instead
    function addItem(post){
      post.email = JSON.parse(window.localStorage.profile).email;
      if($scope.position && $scope.position.lng && $scope.position.lat){
        post.longitude = $scope.position.lng;
        post.latitude = $scope.position.lat;
      }
      $http({
        method:'POST',
        url: '/listings',
        data: post
      }).then($scope.refreshUserListings);
    };

function yourListings() {
    //in order to sort by a person's listing, we grab their email address out of the localStorage. It was stored there after the person logged in with OAuth. If OAuth is not used, another method of getting their email must be used, or just set the person's email address in localStorage in the same place and let the existing code stay the same.
      $scope.email = JSON.parse(window.localStorage.profile).email;
      refreshUserListings();
    }

    function goToUserAcc() {
    $window.location.href  = $window.location.href + 'userAccount'
    }

    function sendEmail(item){
     var subj = "Inquiry regarding " + item.name;
     var message = "Dear item owner,"
     $window.open("mailto:" + item.email + "?subject=" + subj + "&body=" + message, "_self");
   };

    // /again, similar to refresh above, but causes unknown bug when refactor is tried. Can be placed in a shared factory instead of here.
    function refreshUserListings() {
      $http({
        method:'GET',
        url: '/listings'
      }).success(function(res) {
        $scope.yourItems = res;
      });
    }
  }

})();
