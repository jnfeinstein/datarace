angular.module('dashboard', [])

.controller('DashboardCtrl', ['$scope', 'challenges',
  function($scope, challenges) {
    challenges.get();
  }])

;
