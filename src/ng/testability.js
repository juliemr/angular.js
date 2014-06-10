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


    return testability;
  }];
}
