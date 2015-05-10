var files = {
  "http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone.js": 17723,
  "http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.15/angular.js": 241976,
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

.controller('HomeCtrl', function($scope, $http, $q, Invites, SERVER_URL, formatSizeUnits) {
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
      $scope.report();
    }
  };

  $scope.startDownload = function() {
    if ($scope.xhr) return;
    $scope.total = 0;
    $scope.time = 0;
    $scope.average = 0;
    download();
  };

  $scope.report = function() {
    $http.post(SERVER_URL + "counters", {bytes: $scope.total});
  };

  $scope.getAverage = function() {
    return [new Date().getTime(), $scope.average];
  };

  // helpers
  function download() {
    if (!$scope.downloading) return;

    var cacheBuster = "?cache=" + new Date().getTime();
    var url = "http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.15/angular.js" + cacheBuster;
    $scope.canceler = $q.defer();
    $scope.xhr = $http.jsonp(url, {timeout: $scope.canceler}).success(downloadCallback).error(downloadCallback);
  }

  function downloadCallback(data, status, headers, config) {
    var match = config.url.match(/(.*)\?cache=(\d+)/);
    var file = match[1];
    var startTime = match[2];
    var endTime = new Date().getTime();

    var fileSize = files[file];
    $scope.total = $scope.total + fileSize;
    $scope.humanTotal = formatSizeUnits($scope.total);
    $scope.time = $scope.time + (endTime - startTime);
    $scope.average = ($scope.total / $scope.time) * 1000;
    if ($scope.downloading) {
      download();
    }
  }
})

.controller('LeaderboardCtrl', function($scope, Leaders) {
  $scope.leaders = Leaders.all();
  $scope.remove = function(chat) {
    Leaders.remove(chat);
  };

  $scope.doRefresh = function() {
    setTimeout(function() {
      $scope.$broadcast('scroll.refreshComplete');
    }, 1000);
  };
})

.controller('ChallengesCtrl', function($scope, Challenges, Invites) {
  fetch();

  $scope.acceptChallenge = function(chat) {
    Challenges.remove(chat);
  };

  $scope.ignoreChallenge = function(chat) {
    Challenges.remove(chat);
  };

  $scope.doRefresh = function() {
    fetch(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  function fetch(callback) {
    $scope.invites = Invites.query();
    $scope.challenges = Challenges.query(callback);
  }
})

.controller('AccountCtrl', function($scope, auth, store, $location, Users, $http, SERVER_URL, formatSizeUnits) {
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
});

