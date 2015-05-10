angular.module('app')

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

;
