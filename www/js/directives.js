angular.module('smoothie-directive', [])
.directive('smoothieGrid', function() {
  return {
    template: '<canvas ng-transclude></canvas>',
    replace: true,
    transclude: true,
    restrict: 'E',

    scope: {
      background: '@',
      lineColor:  '@',
      lineWidth:  '@',
      labelColor: '@',
      millisPerLine: '@',
      verticalSections: '@',
    },

    controller: function($scope, $element) {
      this.canvas = $element[0];

      this.smoothie = new SmoothieChart({
        minValue: 0,
        yMinFormatter: function() {
          return 0;
        },
        yMaxFormatter: function(max, precision) {
          return formatSizeUnits(parseFloat(max)) + "ps";
        },
        grid: {
          strokeStyle: $scope.lineColor || 'transparent',
          lineWidth: 1,
          strokeStyle: '#777777',
          verticalSections: 2,
          borderVisible: true,
          fillStyle: $scope.background || 'transparent',
          millisPerLine: $scope.millisPerLine,
          verticalSections: $scope.verticalSections,
          sharpLines: false,
        },
        labels: {
          fillStyle: 'black',
          disabled: false,
          precision: 2,
        }
      });
    }
  };
})

.directive('timeSeries', function($interval) {
  return {
    restrict: 'E',
    require: '^smoothieGrid',

    scope: {
      rate:  '@',
      color: '@',
      width: '@',
      fill:  '@',
      callback: '&',
      lineWidth: '@',
    },

    controller: function($scope, $element) {
      $scope.rate = $scope.rate || 1000;
      $scope.line = new TimeSeries();
      $scope.callback = $scope.callback ? $scope.callback : function() { return false; };
    },

    link: function(scope, element, attrs, controller) {
      controller.smoothie.streamTo(controller.canvas, scope.rate);

      controller.smoothie.addTimeSeries(scope.line, {
        strokeStyle: scope.color || 'green',
        fillStyle: scope.fill,
        lineWidth: scope.width || 2
      });

      var updateInterval = $interval(function() {
        var point = scope.callback();
        scope.line.append(point[0], point[1]);
      }, scope.rate);

      element.on('$destroy', function() {
        $interval.cancel(updateInterval);
      });
    }
  };
});

function formatSizeUnits(bytes){
  if      (bytes>=1000000000) {bytes=(bytes/1000000000).toFixed(2)+' GB';}
  else if (bytes>=1000000)    {bytes=(bytes/1000000).toFixed(2)+' MB';}
  else if (bytes>=1000)       {bytes=(bytes/1000).toFixed(2)+' KB';}
  else if (bytes>1)           {bytes=bytes+' bytes';}
  else if (bytes==1)          {bytes=bytes+' byte';}
  else                        {bytes='0 byte';}
  return bytes;
}
