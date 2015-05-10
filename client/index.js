window.angular = require('angular');
require('angular-cookies');
require('angular-jwt');
require('angular-route');
require('angular-storage');
require('angular-bootstrap');

angular.module('app', [
  'angular-jwt',
  'angular-storage',
  'authentication',
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

.config(['authProvider', '$routeProvider', '$httpProvider', 'jwtInterceptorProvider',
  function(authProvider, $routeProvider, $httpProvider, jwtInterceptorProvider) {
    jwtInterceptorProvider.tokenGetter = ['AuthTools', function(AuthTools) {
      return AuthTools.token();
    }];
    $httpProvider.interceptors.push('jwtInterceptor');
  }])

.controller.apply(this, require("./downloader/DownloadController.js"))
.directive("downloader", function() {
  return {
    templateUrl: "downloader/index.html"
  }
})

;

require('./authentication');