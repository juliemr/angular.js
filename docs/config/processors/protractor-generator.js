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
    var protractorDoc = {
      docType: 'protractorTests',
      id: 'protractorTests',
      template: path.join(protractor),
      file: example.doc.file,
      startingLine: example.doc.startingLine,
      example: example,
      path: file.name,
      outputPath: outputPath(example, file.name),
      fileContents: file.fileContents
    };

    _.forEach(examples, function(example) {

      // Create a new document for the example
      var exampleDoc = createExampleDoc(example);
      docs.push(exampleDoc);

      // Create a new document for each file of the example
      _.forEach(example.files, function(file) {
        var fileDoc = createFileDoc(example, file);
        docs.push(fileDoc);

        // Store a reference to the fileDoc in the relevant property on the exampleDoc
        if ( file.type == 'css' ) {
          exampleDoc.stylesheets.push(fileDoc);
        } else if ( file.type == 'js' ) {
          exampleDoc.scripts.push(fileDoc);
        }
      });
    });
  }
};