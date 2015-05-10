angular.module('authentication')

.config(['authProvider',
  function(authProvider){
    authProvider.init({
      domain: 'datarace.auth0.com',
      clientID: 'anDND1WDueNYUpAyiwp4JN5sJVfZGsfC',
      callbackURL: location.href,
      loginUrl: '/home'
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
            $location.path('/home');
          }
        }
      }
    });
  }])

;
