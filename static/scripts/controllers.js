'use strict';

/* Controllers */

var api = 'api';
var controllers = angular.module('controllers', []);

controllers.controller('HomeCtrl', ['$scope', '$http', '$location', '$interval',
  function($scope, $http, $location, $interval) {
  	$scope.isActive = function(route) {
        return route === $location.path();
    };
    var refreshData = function(){
      $http.get(api+'/server', $scope.data).
        success(function(data) {
          if (data.ret === 302){
            if(data.url.indexOf("http") == 0){
              $window.location.href = data.url;
            } else{
              $location.path(data.url);
            }
          }else if (data.ret === 1){
            alert(data.message);
          }else{
            $scope.data = data.data;
            $scope.beanstalkd = data.beanstalkd;
          }
        }
      );
    };
    refreshData();
    var promise = $interval(refreshData, 2000);
    // Cancel interval on page changes
    $scope.$on('$destroy', function(){
        if (angular.isDefined(promise)) {
            $interval.cancel(promise);
            promise = undefined;
        }
    });

    $scope.new_tube_name = '';
    $scope.new_tube_concurrency = '';
    $scope.add = function(){
      if ($scope.new_tube_name && $scope.new_tube_concurrency){
        var data = {queue_name: $scope.new_tube_name, concurrency: $scope.new_tube_concurrency};
        $http.post(api+'/server/save', data).
          success(function(data) {
            if (data.ret === 1){
              alert('操作失败');
            }else{
              refreshData();
            }

          });
      } else {
       alert('队列名和并发数不能为空'); 
      }
    };

    $scope.restart = function(queue_name, concurrency){
      if (queue_name && concurrency){
        var data = {queue_name: queue_name, concurrency: concurrency};
        $http.post(api+'/server/save', data).
          success(function(data) {
            if (data.ret === 1){
              alert('重启失败');
            }else{
              refreshData();
            }

          });
      } else {
        alert('队列名和并发数不能为空'); 
      }
    };

    $scope.stop = function(queue_name){
      if (queue_name){
        var data = {queue_name: queue_name};
        $http.post(api+'/server/stop', data).
          success(function(data) {
            if (data.ret === 1){
              alert('停止失败');
            }else{
              refreshData();
            }

          });
      } else {
        alert('队列名不能为空'); 
      }
    };

    $scope.delete = function(queue_name){
      if (queue_name){
        var data = {queue_name: queue_name};
        $http.post(api+'/server/delete', data).
          success(function(data) {
            if (data.ret === 1){
              alert('删除失败');
            }else{
              refreshData();
            }

          });
      } else {
        alert('队列名不能为空'); 
      }
    };

  }
]);


controllers.controller('AboutCtrl', ['$scope', '$http', '$location',
  function($scope, $http, $location) {
  	$scope.isActive = function(route) {
        return route === $location.path();
    };
  }
]);