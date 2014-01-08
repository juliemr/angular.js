// A reference configuration file.
exports.config = {
  // The timeout for each script run on the browser. This should be longer
  // than the maximum time your application needs to stabilize between tasks.
  allScriptsTimeout: 11000,

  // ----- What tests to run -----
  //
  // Spec patterns are relative to the location of this config.
  specs: [
    'build/docs/ptore2e/**/*.js',
  ],

  // ----- Capabilities to be passed to the webdriver instance ----
  //
  // For a full list of available capabilities, see
  // https://code.google.com/p/selenium/wiki/DesiredCapabilities
  // and
  // https://code.google.com/p/selenium/source/browse/javascript/webdriver/capabilities.js
  capabilities: {
    'browserName': 'chrome'
  },

  // For travis:
  // We want to run grunt protractor somewhere on the travis VM. 
  // Want to use saucelabs for the webdriver browser.
  // sauceUser... make a new config with that added.
  // What do we need to do to make sure that saucelabs can see the server started
  // with connect:testserver? 

  // ----- More information for your tests ----
  //
  // A base URL for your application under test. Calls to protractor.get()
  // with relative paths will be prepended with this.
  baseUrl: 'http://localhost:8000/build/docs/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
