angular.module('main', ['app', 'userAccount', 'login'])

  .controller('sharedController', function($scope, $http, $window, Shared){

  //this gets the users current location within the app
    $scope.env = $window.location.href.split('#');

  //this asks the user to provide their location. If they agree, the users longitude and latitude will be stored. This will be used later as the position when the user adds an item from the userAccount page.
    navigator.geolocation.getCurrentPosition(function(position) {
      $scope.position = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
    });

  //sets up the category options
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

//creates a map based on the passed in parameters. This is reused on each listing that shows on the home.html page
    $scope.initMap = function(entry, index){
      if(entry.latitude && entry.longitude){
        var map = new google.maps.Map(document.getElementById('listentry-' + index), {
          center: {lat: entry.latitude, lng: entry.longitude},
          zoom: 12
        });
      }
    }

//pulls the latest data from the server. Used many times throughout the app to ensure latest data in the scope 'lists' variable
    $scope.refresh = function(){
      Shared.refreshed().then(function(res){
        $scope.lists = res.data;
      });
    }

//basically the same thing as 'refresh' above, but it updates a different scope variable, 'query' instead of 'lists'
    $scope.queryUpdater = function(){
      Shared.refreshed().then(function(data){ $scope.query = data});
    }

//again, similar to refresh above, but causes unknown bug when refactor is tried. Can be placed in a shared factory instead of here.
    var refreshUserListings = function() {
      $http({
        method:'GET',
        url: '/listings'
      }).success(function(res) {
        $scope.yourItems = res;
      });
    }

//serves the userAccount.html page into ng-view on index.html
    $scope.goToUserAcc = function() {
      $window.location.href  = $window.location.href + 'userAccount'
    }

//serves the home.html page into ng-view on index.html
    $scope.viewAllListings = function() {
      $window.location.href = $window.location.origin;
    }
//refresh general listings and creates a new map per item via settimeout and forEach
    $scope.generalListings = function() {
      Shared.refreshed().then(function(res){
        $scope.lists = res.data
        setTimeout(function() {
          $scope.lists.forEach($scope.initMap);
          $scope.$apply();
        }, 1);
      });
    }

//searches the database based on the category
    $scope.search = function(category){
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

    $scope.yourListings = function() {
    //in order to sort by a person's listing, we grab their email address out of the localStorage. It was stored there after the person logged in with OAuth. If OAuth is not used, another method of getting their email must be used, or just set the person's email address in localStorage in the same place and let the existing code stay the same.
      $scope.email = JSON.parse(window.localStorage.profile).email;
      refreshUserListings();
    }

  //rents an item by changing it's rentable status in the db to false. When two people click on an item to rent, it can cause an error.
    $scope.rent = function(item){
      item.rentable = false;
      item.renter = JSON.parse(window.localStorage.profile).email;
      $http({
        method: 'PUT',
        url: '/listings/' + item._id,
        data: item
      });
    };

    $scope.sendEmail = function(item){
     var subj = "Inquiry regarding " + item.name;
     var message = "Dear item owner,"
     $window.open("mailto:" + item.email + "?subject=" + subj + "&body=" + message, "_self");
   };
})
