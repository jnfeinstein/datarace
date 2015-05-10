window.angular = require('angular');
require('angular-cookies');
require('angular-jwt');
require('angular-resource');
require('angular-route');
require('angular-storage');
require('angular-bootstrap');

require('./authentication');
require('./home');
require('./dashboard');
require('./widgets');
require('./api');

angular.module('app', [
  'api.challenges',
  'authentication',
  'dashboard',
  'home',
  'ngRoute',
  'templates',
  'ui.bootstrap',
  'widgets'
])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/dashboard', {
        templateUrl: 'dashboard/index.html',
        requiresLogin: true
      }).
      when('/home', {
        templateUrl: 'home/index.html',
      }).
      otherwise({
        redirectTo: function() {
          return "/home";
        }
      });
  }])

.config(['authProvider', '$routeProvider', '$httpProvider', 'jwtInterceptorProvider',
  function(authProvider, $routeProvider, $httpProvider, jwtInterceptorProvider) {
    jwtInterceptorProvider.tokenGetter = ['AuthTools', function(AuthTools) {
      return AuthTools.token();
    }];
    $httpProvider.interceptors.push('jwtInterceptor');
  }])

;
