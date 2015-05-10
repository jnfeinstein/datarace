angular.module('authentication')

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
        $location.path('/dashboard');
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

    return AuthTools;
  }])

;
