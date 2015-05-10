window.Auth0Lock = require('auth0-lock');
require('auth0-angular');

angular.module('authentication', [
  'auth0'
]);

require('./auth-tools');
require('./setup');
