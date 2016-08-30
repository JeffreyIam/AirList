(function() {
  'use strict';

  angular
  .module('services')
  .factory('SharedFunctions', SharedFunctions);

  SharedFunctions.$inject = ['$window', '$http', 'mainFactory'];

  function SharedFunctions($window, $http, mainFactory) {

    var service = {
      // queryUpdater: queryUpdater,
      refresh: refresh,
      rent: rent,
      search: search,
      viewAllListings: viewAllListings,
      logout: logout
    };

    return service;

    // function queryUpdater(){
    //   mainFactory.refreshed().then(function(data){ $scope.query = data});
    // }

    function refresh(){
      mainFactory.refreshed().then(function(res){
        $scope.lists = res.data;
      });
    }

    function rent(item){
      item.rentable = false;
      item.renter = JSON.parse(window.localStorage.profile).email;
      $http({
        method: 'PUT',
        url: '/listings/' + item._id,
        data: item
      });
    };

    function search(category){
      console.log(category,'$$$$');
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

    function viewAllListings() {
      $window.location.href = $window.location.origin;
    }

    function logout() {
      window.localStorage.clear();
      $window.location.href = '/'
    }
  }
})();

