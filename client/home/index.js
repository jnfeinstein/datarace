angular.module('home', [])

.controller('HomeCtrl', ['$scope', 'AuthTools',
  function($scope, AuthTools) {
    $scope.login = AuthTools.login;
  }])

;