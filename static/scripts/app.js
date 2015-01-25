'use strict';

/* App Module */
var App = angular.module('App', [
  'ngRoute',
  'ngTouch',

  'controllers',
  'filters'
]);

App.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
});
App.config(function($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
});
App.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      }).
      when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      }).
      otherwise({
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      });
  }]);

