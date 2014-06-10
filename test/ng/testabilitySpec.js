'use strict';

ddescribe('$testability', function() {
  describe('allow animations', function() {

  });

  describe('finding elements', function() {
    var $testability, $compile, scope, element;
    beforeEach(inject(function(_$testability_, _$compile_, $rootScope) {
      $testability = _$testability_;
      $compile = _$compile_;
      scope = $rootScope.$new();
    }));

    afterEach(function() {
      scope.$destroy();
    });

    it('should find partial bindings', function() {
      element =
          '<div>' +
          '  <span>{{name}}</span>' +
          '  <span>{{username}}</span>' +
          '</div>';
      element = $compile(element)(scope);
      var names = $testability.findBindings(element[0], 'name');
      expect(names.length).toBe(2);
      expect(names[0]).toBe(element.find('span')[0]);
      expect(names[1]).toBe(element.find('span')[1]);
    });

    it('should find exact bindings', function() {
      element =
          '<div>' +
          '  <span>{{name}}</span>' +
          '  <span>{{username}}</span>' +
          '</div>';
      element = $compile(element)(scope);
      var users = $testability.findBindings(element[0], 'username', true);
      expect(users.length).toBe(1);
      expect(users[0]).toBe(element.find('span')[1]);
    });

    it('should find findings by class', function() {
      element =
          '<div>' +
          '  <span ng-bind="name"></span>' +
          '  <span>{{username}}</span>' +
          '</div>';
      element = $compile(element)(scope);
      var users = $testability.findBindings(element[0], 'username', true);
      expect(users.length).toBe(1);
      expect(users[0]).toBe(element.find('span')[1]);
    });

    it('should only search within the context element', function() {
      element =
          '<div>' +
          '  <div><span>{{name}}</span></div>' +
          '  <div><span>{{name}}</span></div>' +
          '</div>';
      element = $compile(element)(scope);
      var users = $testability.findBindings(element.find('div')[0], 'username', true);
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
