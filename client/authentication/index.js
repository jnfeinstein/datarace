window.Auth0Lock = require('auth0-lock');
require('auth0-angular');

angular.module('authentication', [
  'auth0'
])

.config(['authProvider',
  function(authProvider){
    authProvider.init({
      domain: 'datarace.auth0.com',
      clientID: 'anDND1WDueNYUpAyiwp4JN5sJVfZGsfC'
    });
  }])

.run(['auth',
  function(auth) {
    auth.hookEvents();
  }])

.run(['$rootScope', 'auth', 'jwtHelper', 'AuthTools',
  function($rootScope, auth, jwtHelper, AuthTools) {
    $rootScope.$on('$locationChangeStart', function() {
      if (!AuthTools.loggedIn()) {
        var token = AuthTools.token();
        if (token) {
          if (!jwtHelper.isTokenExpired(token)) {
            auth.authenticate(AuthTools.profile(), token);
          } else {
            // Either show Login page or use the refresh token to get a new idToken
            $location.path('/');
          }
        }
      }
    });
  }])

.factory('AuthTools', ['$location', 'auth', 'store',
  function($location, auth, store) {
    var AuthTools = {};

    AuthTools.token = function(t) {
      if (!arguments.length) {
        return store.get('token');
      } else if (t) {
        store.set('token', t);
      } else {
        store.remove('token');
      }
    }

    AuthTools.profile = function(p) {
      if (!arguments.length) {
        return store.get('profile');
      } else if (p) {
        store.set('profile', p);
      } else {
        store.remove('profile');
      }
    }

    AuthTools.login = function() {
      auth.signin({}, function(profile, token) {
        // Success callback
        AuthTools.profile(profile);
        AuthTools.token(token);
        $location.path('/');
      }, function() {
        // Error callback
      });
    }

    AuthTools.loggedIn = function() {
      return auth.isAuthenticated;
    }

    AuthTools.logout = function() {
      auth.signout();
      AuthTools.profile(null);
      AuthTools.token(null);
    }

    window.AuthTools = AuthTools;

    return AuthTools;
  }])

;
