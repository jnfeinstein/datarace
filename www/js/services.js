angular.module('starter.services', [])

.factory('Leaders', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var leaders = [{
    id: 0,
    name: 'Ben Sparrow',
    total: '2000 MB',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    total: '1700 MB',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  },{
    id: 2,
    name: 'Adam Bradleyson',
    total: '1300 MB',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    total: '200 MB',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }, {
    id: 4,
    name: 'Mike Harrington',
    total: '20 MB',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return leaders;
    },
    remove: function(leader) {
      leaders.splice(leaders.indexOf(leader), 1);
    },
    get: function(id) {
      id = parseInt(id, 10);
      for (var i = 0; i < leaders.length; i++) {
        if (leaders[i].id === id) {
          return leaders[i];
        }
      }
      return null;
    }
  };
})
.factory('Challenges', function(store, $resource, SERVER_URL) {
  return $resource(SERVER_URL + 'challenges/:id');
})
.factory('Invites', function(store, $resource, SERVER_URL) {
  return $resource(SERVER_URL + 'invites/:id');
})
.factory('Users', function(store, $resource, SERVER_URL) {
  return $resource(SERVER_URL + 'users/:id', null, {
    'me': { method: 'GET' },
  });
})
;
