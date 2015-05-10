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
  'home',
  'ngRoute',
  'templates',
  'ui.bootstrap',
  'widgets'
]);

require('./setup');
require('./authentication');
require('./home');
require('./widgets');