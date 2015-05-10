angular.module('api.challenges', [
  'ngResource'
])

.factory('challenges', ['$resource',
  function($resource) {
    return $resource('/challenges', null, {
      'get': {
        method:'GET',
        isArray: true
      }
    });
  }])

;
