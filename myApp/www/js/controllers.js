var files = {
  "http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone.js": 17723,
  "http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.15/angular.js": 241976,
};


angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, $http, $q, Challenges) {
  $scope.pendingChallenges = Challenges.all('pending');
  $scope.pendingChallengeNames = _.pluck($scope.pendingChallenges, "name").join(", ");
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
    console.log("REPORT", $scope.total, $scope.time, $scope.average);
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
    $scope.xhr = $http.get(url, {timeout: $scope.canceler}).success(downloadCallback).error(downloadCallback);
  }

  function downloadCallback(data, status, headers, config) {
    var match = config.url.match(/(.*)\?cache=(\d+)/);
    var file = match[1];
    var startTime = match[2];
    var endTime = new Date().getTime();

    var fileSize = files[file];
    $scope.total = $scope.total + fileSize;
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
})

.controller('ChallengesCtrl', function($scope, Challenges) {
  $scope.challenges = Challenges.all();
  $scope.pendingChallenges = Challenges.all('pending');

  $scope.acceptChallenge = function(chat) {
    Challenges.remove(chat);
  };
  $scope.ignoreChallenge = function(chat) {
    Challenges.remove(chat);
  };
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

