'use strict';


function $TestabilityProvider() {
  this.$get = ['$rootScope', '$browser', '$location',
       function($rootScope,   $browser,   $location) {

    var testability = {};

    /**
     * Returns an array of elements that are bound (via ng-bind or {{}})
     * to expressions matching the input.
     */
    testability.findBindings = function(element, expression, opt_exactMatch) {
      // so, one option would be to have ngBind call to this service to register it. But that
      // seems like a pain for managing stuff.
      // On the other hand, bindings already all set the class to ng-binding
      // and add the $binding property to the data.

      // Interpolation has to work as well.
      // Interpolation is added as a directive in $compile
      // - https://github.com/angular/angular.js/blob/master/src/ng/compile.js#L1843


      // // remember, ngBind is just adding a watch and then modifying element.text
      // // We'd need to look at child scopes as well. And need a way to tie the
      // // expression back to its element. AFAIK that's only known through what's done inside
      // // closures in the listener function - which we can't really parse.


      /* ... The old way that works ... */
      var bindings = element.getElementsByClassName('ng-binding');
      var matches = [];
      for (var i = 0; i < bindings.length; ++i) {
        var dataBinding = angular.element(bindings[i]).data('$binding');
        if (dataBinding) {
          var bindingName = dataBinding.exp || dataBinding[0].exp || dataBinding;
          if (opt_exactMatch) {
            var matcher = new RegExp('([^a-zA-Z\\d]|$)' + expression + '([^a-zA-Z\\d]|^)');
            if (matcher.test(bindingName)) {
              matches.push(bindings[i]);
            }
          } else {
            if (bindingName.indexOf(expression) != -1) {
              matches.push(bindings[i]);
            }
          }
          
        }
      }
      return matches;
    };

    /**
     * Returns an array of elements that are two-way found via ng-model to
     * expressions matching the input.
     */
    testability.findModels = function(element, expression, opt_exactMatch) {
      // Model watch is set up here:
      // - https://github.com/angular/angular.js/blob/master/src/ng/directive/input.js#L1854
      // TODO - get rid of stupid prefix search.
      var prefixes = ['ng-', 'ng_', 'data-ng-', 'x-ng-', 'ng\\:'];
      for (var p = 0; p < prefixes.length; ++p) {
        var attributeEquals = opt_exactMatch ? '=' : '*=';
        var selector = '[' + prefixes[p] + 'model' + attributeEquals + '"' + expression + '"]';
        var elements = element.querySelectorAll(selector);
        if (elements.length) {
          return elements;
        }
      }
    };

    /**
     * Shortcut for getting the location in a browser agnostic way.
     */
    testability.getLocation = function() {
      return $location.absUrl();
    };

    /**
     * Shortcut for navigating to a location without doing a full page reload.
     */
    testability.setLocation = function(path) {
      if (path !== $location.path()) {
        $location.path(path);
        $rootScope.$digest();
      }
    };

    /**
     * Calls the callback when $timeout and $http
     * requests are completed. Move from $browser
     */
    testability.notifyWhenStable = function(callback) {
      $browser.notifyWhenNoOutstandingRequests(callback);
    };

    return testability;
  }];
}
