var files = {
  "http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone.js": 17723,
  "http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.15/angular.js": 241976,
};

module.exports = ["DownloadController", ["$scope", "$http", function($scope, $http) {
    $scope.limit = 5;
    $scope.running = false;
    $scope.total = 0;
    $scope.time = 0;
    $scope.average = 0;

    $scope.startDownload = function() {
      $scope.reset();
      $scope.running = true;
      $scope.download();
    };

    $scope.download = function(limit) {
      var cacheBuster = "?cache=" + new Date().getTime();
      var url = "http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.15/angular.js" + cacheBuster;

      var xhr = $http.get(url).success(downloadCallback).error(downloadCallback);
    };

    $scope.report = function() {
      $scope.running = false;
      console.log("Downloaded: ", $scope.total);
    };

    $scope.reset = function() {
      $scope.total = 0;
    };

    // helpers

    function downloadCallback(data, status, headers, config) {
      var match = config.url.match(/(.*)\?cache=(\d+)/);
      var file = match[1];
      var startTime = match[2];
      var endTime = new Date().getTime();

      var fileSize = files[file];
      $scope.total = $scope.total + fileSize;
      $scope.time = $scope.time + (endTime - startTime);
      $scope.average = ($scope.total / $scope.time) * 1000;
      if ($scope.total < ($scope.limit*1024*1024)) {
        $scope.download();
      } else {
        $scope.report();
      }
    }
  }]
];
