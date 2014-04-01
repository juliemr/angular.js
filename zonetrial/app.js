'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['ngRoute']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/async', {templateUrl: 'async/async.html', controller: AsyncCtrl});
    $routeProvider.when('/slowloader', {
      templateUrl: 'async/async.html',
      controller: AsyncCtrl,
      resolve: {
        slow: function($timeout) {
          return $timeout(function() {}, 2000);
        }
      }
    });
    $routeProvider.otherwise({redirectTo: '/async'});
  }]);
