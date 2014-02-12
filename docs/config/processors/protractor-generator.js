var _ = require('lodash');
var log = require('winston');
var path = require('canonical-path');
var trimIndentation = require('dgeni/lib/utils/trim-indentation');
var code = require('dgeni/lib/utils/code');
var templateFolder, outputFolder, commonFiles;


function outputPath(example, fileName) {
  return path.join(example.outputFolder, fileName);
}

function createExampleDoc(example) {
  var exampleDoc = {
    id: example.id,
    docType: 'example',
    template: path.join(templateFolder, 'index.template.html'),
    file: example.doc.file,
    startingLine: example.doc.startingLine,
    example: example,
    path: example.id,
    outputPath: example.outputFolder + '/index.html'
  };

  // Copy in the common scripts
  exampleDoc.scripts = _.map(commonFiles.scripts || [], function(script) { return { path: script }; });
  exampleDoc.stylesheets = _.map(commonFiles.stylesheets || [], function(stylesheet) { return { path: stylesheet }; });

  // If there is an index.html file specified then use it contents for this doc
  // and remove it from the files property
  if ( example.files['index.html'] ) {
    exampleDoc.fileContents = example.files['index.html'].fileContents;
    delete example.files['index.html'];
  }
  return exampleDoc;
}

function createFileDoc(example, file) {
  var fileDoc = {
    docType: 'example-' + file.type,
    id: example.id + '/' + file.name,
    template: path.join(templateFolder, 'template.' + file.type),
    file: example.doc.file,
    startingLine: example.doc.startingLine,
    example: example,
    path: file.name,
    outputPath: outputPath(example, file.name),
    fileContents: file.fileContents
  };
  return fileDoc;
}


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