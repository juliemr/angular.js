'use strict';
var GLOBAL_ZONE_ID = 0;

function Zone(parentZone, data) {
  var zone = (arguments.length) ? Object.create(parentZone) : this;

  zone.parent = parentZone;

  Object.keys(data || {}).forEach(function(property) {
    zone[property] = data[property];
  });

  zone.id = GLOBAL_ZONE_ID++;

  return zone;
}


Zone.prototype = {
  constructor: Zone,

  // Zones know about parents but not about children. So, there's not really
  // any good way for a zone to know if everything associated with it is done
  // or not.
  // We could modify the patching functions to keep track of the # of outstanding
  // things.
  fork: function (locals) {
    console.log('forking zone ' + this.id.toString());
    return new Zone(this, locals);
  },

  bind: function (fn) {
    var zone = this.fork();
    return function zoneBoundFn() {
      return zone.run(fn, this, arguments);
    };
  },

  run: function run (fn, applyTo, applyWith) {
    applyWith = applyWith || [];

    var oldZone = window.zone,
        result;

    window.zone = this;

    try {
      this.onZoneEnter();
      result = fn.apply(applyTo, applyWith);
    } catch (e) {
      if (zone.onError) {
        zone.onError(e);
      }
    } finally {
      this.onZoneLeave();
      window.zone = oldZone;
    }
    return result;
  },

  onZoneEnter: function () {},
  onZoneLeave: function () {}
};

// obj == window, fnNames = ['setTimeout', 'setInterval']
Zone.patchFn = function (obj, fnNames) {
  fnNames.forEach(function (name) {
    var delegate = obj[name];
    // ^ window.setTimeout;
    // zone.setTimeout
    zone[name] = function () {
      arguments[0] = zone.bind(arguments[0]);
      // arguments[0] is the function
      // zone.bind makes a new fork of the zone (which might not actually create a new zone??)
      //  and runs the function in it
      // remember that making a new fork calls onZoneEnter
      return delegate.apply(obj, arguments);
    };

    obj[name] = function marker () {
      return zone[name].apply(this, arguments);
    };
  });
};

Zone.patchableFn = function (obj, fnNames) {
  fnNames.forEach(function (name) {
    var delegate = obj[name];
    zone[name] = function () {
      return delegate.apply(obj, arguments);
    };

    obj[name] = function () {
      return zone[name].apply(this, arguments);
    };
  });
}

Zone.patchProperty = function (obj, prop) {
  var desc = Object.getOwnPropertyDescriptor(obj, prop) || {
    enumerable: true,
    configurable: true
  };

  // A property descriptor cannot have getter/setter and be writable
  // deleting the writable and value properties avoids this error:
  //
  // TypeError: property descriptors must not specify a value or be writable when a
  // getter or setter has been specified
  delete desc.writable;
  delete desc.value;

  // substr(2) cuz 'onclick' -> 'click', etc
  var eventName = prop.substr(2);
  var _prop = '_' + prop;

  desc.set = function (fn) {
    if (this[_prop]) {
      this.removeEventListener(eventName, this[_prop]);
    }

    this[_prop] = fn;

    this.addEventListener(eventName, fn, false);
  };

  desc.get = function () {
    return this[_prop];
  };

  Object.defineProperty(obj, prop, desc);
};

Zone.patchProperties = function (obj) {
  Object.keys(obj).
    filter(function (propertyName) {
      return propertyName.substr(0,2) === 'on';
    }).
    forEach(function (eventName) {
      Zone.patchProperty(obj, eventName);
    });
};

Zone.patchEventTarget = function (obj) {
  var addDelegate = obj.addEventListener;
  obj.addEventListener = function (eventName, fn) {
    arguments[1] = fn._bound = zone.bind(fn);
    return addDelegate.apply(this, arguments);
  };

  var removeDelegate = obj.removeEventListener;
  obj.removeEventListener = function (eventName, fn) {
    arguments[1] = arguments[1]._bound || arguments[1];
    return removeDelegate.apply(this, arguments);
  };
};

Zone.patch = function patch () {
  Zone.patchFn(window, ['setTimeout', 'setInterval']);
  Zone.patchableFn(window, ['alert', 'prompt']);

  // patched properties depend on addEventListener, so this comes first
  Zone.patchEventTarget(EventTarget.prototype);

  Zone.patchProperties(HTMLElement.prototype);
  Zone.patchProperties(XMLHttpRequest.prototype);
};

Zone.init = function init () {
  window.zone = new Zone();
  Zone.patch();
};


Zone.init();
