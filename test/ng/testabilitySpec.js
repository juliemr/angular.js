'use strict';

ddescribe('$testability', function() {
  describe('allow animations', function() {

  });

  describe('finding elements', function() {
    var $testability, element;
    beforeEach(inject(function(_$testability_, $compile, $rootScope) {
      $testability = _$testability_;
      element =
          '<div>' +
          '  <span>{{name}}</span>' +
          '  <span>{{username}}</span>' +
          '</div';
      element = $compile(element)($rootScope);
    }));

    it('should find partial bindings', function() {
      var names = $testability.findBindings(element[0], 'name');
      expect(names.length).toBe(2);
      expect(names[0]).toBe(element.find('span')[0]);
      expect(names[1]).toBe(element.find('span')[1]);
    });

    it('should find exact bindings', function() {
      var users = $testability.findBindings(element[0], 'username', true);
      expect(users.length).toBe(1);
      expect(users[0]).toBe(element.find('span')[1]);
    });
  });

  describe('location', function() {

  });

  xdescribe('outstading requests', function() {
    it('should process callbacks immedietly with no outstanding requests', function() {
      var callback = jasmine.createSpy('callback');
      $testability.notifyWhenNoOutstandingRequests(callback);
      expect(callback).toHaveBeenCalled();
    });
  });
});
