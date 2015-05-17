var files = {
  "http://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.js": 336396,
};


angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, $http, $q, formatSizeUnits) {
  $scope.downloading = false;

  $scope.toggleDownload = function() {
    $scope.downloading = !$scope.downloading;
    if ($scope.downloading) {
      $scope.startDownload();
    } else if($scope.xhr) {
      $scope.canceler.resolve();
      $scope.xhr = null;
      $scope.canceler = null;
    }
  };

  $scope.startDownload = function() {
    if ($scope.xhr) return;
    $scope.total = 0;
    $scope.time = 0;
    $scope.average = 0;
    download();
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
    $scope.total = $scope.total + fileSize;
    $scope.humanTotal = formatSizeUnits($scope.total);
    $scope.time = $scope.time + (endTime - startTime);
    $scope.average = ($scope.total / $scope.time) * 1000;
    if ($scope.downloading) {
      download();
    }
  }
});
