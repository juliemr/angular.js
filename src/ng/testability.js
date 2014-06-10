'use strict';


function $TestabilityProvider() {
  this.$get = ['$rootScope', '$browser', '$exceptionHandler',
       function($rootScope,   $browser,   $exceptionHandler) {

    var testability = {};

    /**
     * Returns an array of elements that are bound (via ng-bind or {{}})
     * to expressions matching the input.
     */
    testability.findBindings = function(element, expression, opt_exactMatch) {
      return [];
    };

    /**
     * Returns an array of elements that are two-way found via ng-model to
     * expressions matching the input.
     */
    testability.findModels = function(element, expressions, opt_exactMatch) {

    };

    /**
     * Shortcut for getting the location in a browser agnostic way.
     */
    testability.getLocation = function() {

    }

    /**
     * Shortcut for navigating to a location without doing a full page reload.
     */
    testability.setLocation = function(path) {

    }

    /**
     * Calls the callback when $timeout and $http
     * requests are completed. Move from $browser
     */
    testability.notifyWhenNoOutstandingRequests = function(path, callback) {
      
    }


    return testability;
  }];
}
