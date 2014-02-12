var _ = require('lodash');
var path = require('canonical-path');
var gitInfo = require('bike-shed/lib/utils/git-info');
var gruntUtils = require('../lib/grunt/utils');
var packagePath = __dirname;

var basePackage = require('bike-shed/packages/docs.angularjs.org');

module.exports = function(config) {

  config = basePackage(config);

  config.set('source.files', [
    { pattern: 'src/**/*.js', basePath: path.resolve(packagePath,'..') },
    { pattern: '**/*.ngdoc', basePath: path.resolve(packagePath, 'content') }
  ]);

  var version = gruntUtils.getVersion();
  var versions = gruntUtils.getPreviousVersions();
  config.set('source.currentVersion', version);
  config.set('source.previousVersions', versions);

  var package = require('../package.json');
  config.merge('rendering.extra', {
    git: gitInfo.getGitRepoInfo(package.repository.url),
    version: version
  });

  config.set('rendering.outputFolder', '../build/docs');

  config.set('logging.level', 'debug');

  config.merge('deployment', {
    environments: [{
      name: 'debug',
      scripts: [
        '../angular.js',
        '../angular-resource.js',
        '../angular-route.js',
        '../angular-cookies.js',
        '../angular-sanitize.js',
        '../angular-touch.js',
        '../angular-animate.js',
        'components/marked/lib/marked.js',
        'js/angular-bootstrap/bootstrap.js',
        'js/angular-bootstrap/bootstrap-prettify.js',
        'components/lunr.js/lunr.js',
        'components/google-code-prettify/src/prettify.js',
        'components/google-code-prettify/src/lang-css.js',
        'js/versions-data.js',
        'js/pages-data.js',
        'js/docs.js'
      ],
      stylesheets: [
        'css/bootstrap/css/bootstrap.css',
        'components/open-sans-fontface/open-sans.css',
        'css/prettify-theme.css',
        'css/docs.css',
        'css/animations.css'
      ]
    },
    {
      name: 'default',
      scripts: [
        '../angular.min.js',
        '../angular-resource.min.js',
        '../angular-route.min.js',
        '../angular-cookies.min.js',
        '../angular-sanitize.min.js',
        '../angular-touch.min.js',
        '../angular-animate.min.js',
        'components/marked/lib/marked.js',
        'js/angular-bootstrap/bootstrap.js',
        'js/angular-bootstrap/bootstrap-prettify.js',
        'components/lunr.js/lunr.min.js',
        'components/google-code-prettify/src/prettify.js',
        'components/google-code-prettify/src/lang-css.js',
        'js/versions-data.js',
        'js/pages-data.js',
        'js/docs.js'
      ],
      stylesheets: [
        'css/bootstrap/css/bootstrap.css',
        'components/open-sans-fontface/open-sans.css',
        'css/prettify-theme.css',
        'css/docs.css',
        'css/animations.css'
      ]
    }]
  });

  return config;
};
