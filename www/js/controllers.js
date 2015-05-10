var files = {
  "http://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.js": 336396,
};


angular.module('starter.controllers', [])

.controller('LoginCtrl', function LoginCtrl(store, $scope, $location, auth, $ionicLoading) {
  $scope.login = function() {
    auth.signin({
      authParams: {
        scope: 'openid offline_access',
        device: 'Mobile device'
      }
    }, function(profile, token, accessToken, state, refreshToken) {
      // Success callback
      store.set('profile', profile);
      store.set('token', token);
      store.set('refreshToken', refreshToken);
      $location.path('/');
    }, function() {
      // Error callback
    });
  };

  $scope.login();
})

.controller('HomeCtrl', function($scope, $http, $q, $interval, Invites, SERVER_URL, formatSizeUnits) {
  var bytesToReport, reportInterval;

  $scope.invites = Invites.query();
  $scope.downloading = false;

  $scope.toggleDownload = function() {
    $scope.downloading = !$scope.downloading;
    if ($scope.downloading) {
      $scope.startDownload();
    } else if($scope.xhr) {
      $scope.canceler.resolve();
      $scope.xhr = null;
      $scope.canceler = null;
      $interval.cancel(reportInterval);
      report();
    }
  };

  $scope.startDownload = function() {
    if ($scope.xhr) return;
    $scope.total = 0;
    $scope.time = 0;
    $scope.average = 0;
    bytesToReport = 0;
    reportInterval = $interval(function() {
      report();
    }, 5000);
    download();
  };

  function report() {
    $http.post(SERVER_URL + "counters", {bytes: bytesToReport});
    bytesToReport = 0;
  };

  $scope.getAverage = function() {
    return [new Date().getTime(), $scope.average];
  };

  // helpers
  function download() {
    if (!$scope.downloading) return;

    var cacheBuster = "?cache=" + new Date().getTime();
    var url = "http://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.js"+ cacheBuster;
    $scope.canceler = $q.defer();
    $scope.xhr = $http.jsonp(url, {timeout: $scope.canceler})
      .success(downloadCallback)
      .error(downloadCallback);
  }

  function downloadCallback(data, status, headers, config) {
    var match = config.url.match(/(.*)\?cache=(\d+)/);
    var file = match[1];
    var startTime = match[2];
    var endTime = new Date().getTime();

    var fileSize = files[file];
    bytesToReport += fileSize;
    $scope.total = $scope.total + fileSize;
    $scope.humanTotal = formatSizeUnits($scope.total);
    $scope.time = $scope.time + (endTime - startTime);
    $scope.average = ($scope.total / $scope.time) * 1000;
    if ($scope.downloading) {
      download();
    }
  }
})

.controller('LeaderboardCtrl', function($scope, Users, formatSizeUnits, trimPicture) {
  $scope.leaders = Users.query();

  $scope.doRefresh = function() {
    $scope.leaders = Users.query(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.hasUsage = function(leader) {
    return leader.bytes && leader.bytes > 0;
  };

  $scope.formatSizeUnits = formatSizeUnits;
  $scope.trimPicture = trimPicture;
})

.controller('ChallengesCtrl', function($scope, $ionicModal, $q, Challenges, Invites, Users, auth, trimPicture, Counters, formatSizeUnits) {
  $scope.challenges = [];
  $scope.invites = [];
  Users.query().$promise.then(function(users) {
    $scope.users = users.filter(function(user) {
      return user._id != auth.profile.user_id.replace('auth0|', '');
    });
  });

  $ionicModal.fromTemplateUrl('templates/new-challenge.html', function(modal) {
    $scope.modal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.addChallenge = function(name) {
    $scope.name = '';
    Challenges.save({
      name: name,
      users: $scope.users.filter(function(user) {
        return user.selected;
      }).map(function(user) {
        return user._id;
      })
    })
      .$promise.then(function(challenge) {
        $scope.users.forEach(function(user) {
          user.selected = false;
        });
        doRefresh();
        $scope.modal.hide();
      });
  }

  $scope.leaveChallenge = function(challenge) {

  }

  $scope.acceptInvite = function(invite) {
    //Challenges.remove(chat);
    Invites.save({
      id: invite._id,
      accept: true
    }).$promise.then(function() {
      doRefresh();
    })
  };

  $scope.ignoreInvite = function(invite) {
    //Challenges.remove(chat);
    Invites.save({
      id: invite._id,
      accept: false
    }).$promise.then(function() {
      doRefresh();
    })
  };

  $scope.doRefresh = function() {
    $q.all([ Challenges.query().$promise, Invites.query().$promise, Counters.query().$promise ])
      .then(function(rez) {
        $scope.challenges = rez[0];
        $scope.invites = rez[1];

        rez[2].forEach(function(counter) {
          $scope.challenges
          .filter(function(challenge) {
            return challenge._id == counter.challenge;
          })
          .forEach(function(challenge) {
            challenge.bytes = formatSizeUnits(counter.bytes);
          })
        });
        $scope.$broadcast('scroll.refreshComplete');
      });
  };

  $scope.trimPicture = trimPicture;

  $scope.doRefresh();
})

.controller('AccountCtrl', function($scope, auth, store, $location, Users, $http, SERVER_URL, formatSizeUnits, trimPicture) {
  $scope.settings = {
    enableFriends: true
  };

  $scope.profile = auth.profile;

  $scope.me = {};

  $scope.logout = function() {
    auth.signout();
    store.remove('profile');
    store.remove('token');
    $location.path('/');
  };

  $scope.doRefresh = function() {
    $http.get(SERVER_URL + "users/me").success(function(data) {
      $scope.me = data;
      $scope.me.humanBytes = formatSizeUnits($scope.me.bytes);
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.doRefresh();

  $scope.trimPicture = trimPicture;
});

