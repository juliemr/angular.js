var _ = require('lodash');
var log = require('winston');
var path = require('canonical-path');
var trimIndentation = require('dgeni/lib/utils/trim-indentation');
var code = require('dgeni/lib/utils/code');
var protractorFolder;

module.exports = {
  name: 'protractor-generate',
  description: 'Generate a protractor test file from the e2e tests in the examples',
  runAfter: ['adding-extra-docs'],
  runBefore: ['extra-docs-added'],
  init: function(config, injectables) {
    protractorFolder = config.get('rendering.protractor.outputFolder', 'ptore2e');
  },
  process: function(docs, examples) {
    _.forEach(examples, function(example) {

      _.forEach(example.files, function(file) {

        // Check if it's a Protractor test.
        if (!(file.type == 'protractor')) {
          return;
        }

        // Create a new file for the test.
        // TODO - generate one for jqLite and one for jQuery
        var protractorDoc = {
          docType: 'e2e-test',
          id: 'protractorTest' + '-' + example.id,
          template: 'protractorTests.template.js',
          outputPath: path.join(protractorFolder, example.id, 'jqlite' + '_test.js'),
          innerTest: file.fileContents,
          pathPrefix: '' // jqlite jquery stuff goes here?
        };

        // TODO - figure out where this info is stored - this isn't precisely right.
        protractorDoc.describeBlock = {
          path: example.doc.path,
        }

        // TODO - add a beforeEach block which switches focus to the iframe.

        docs.push(protractorDoc);
      });
    });
  }
};
