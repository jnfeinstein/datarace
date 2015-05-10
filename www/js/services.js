angular.module('starter.services', [])

.factory('Challenges', function(store, $resource, SERVER_URL) {
  return $resource(SERVER_URL + 'challenges/:id');
})
.factory('Invites', function(store, $resource, SERVER_URL) {
  return $resource(SERVER_URL + 'invites/:inviteId', {inviteId: "@id"});
})
.factory('Users', function(store, $resource, SERVER_URL) {
  return $resource(SERVER_URL + 'users/:id', null, {
    'me': { method: 'GET' },
  });
})
;
