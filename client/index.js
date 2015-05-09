angular = require('angular');
require('angular-route');
require('angular-bootstrap');

angular.module('app', [
  'ngRoute',
  'templates',
  'ui.bootstrap'
])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'home/index.html'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }])

;
