var os = require('os');
var path = require('path');

module.exports.getRequireString = function(filePath, moduleName, inline) {
  return 'require(\'' + filePath + '\')[\'' + moduleName + '\']';
};

module.exports.getSyncLoader = function(filePath, moduleName, inline) {
  var requireString = module.exports.getRequireString(filePath, moduleName);

  var result = [
    'loadChildren: function() {',
    '  return ' + requireString + ';',
    '}'
  ];

  return inline ? result.join('') : result.join('\n');
};

module.exports.getRequireLoader = function(filePath, moduleName, inline) {
  var requireString = module.exports.getRequireString(filePath, moduleName);

  var result = [
    'loadChildren: () => new Promise(function (resolve) {',
    '  require.ensure([], function () {',
    '    resolve(' + requireString + ');',
    '  });',
    '})'
  ];

  return inline ? result.join('') : result.join('\n');
};

module.exports.getSystemLoader = function(filePath, moduleName, inline) {
  var result = [
    'loadChildren: () => System.import(\'' + filePath + '\')',
    '  .then(function(module) {',
    '    return module[\'' + moduleName + '\'];',
    '  })'
  ];

  return inline ? result.join('') : result.join('\n');
};

module.exports.getFilename = function(resourcePath) {
  var filename = path.basename(resourcePath);

  return path.basename(resourcePath, path.extname(filename));
};

module.exports.normalizeFilePath = function(filePath) {
  var newPath = filePath;

  if (!newPath.startsWith('./') && !newPath.startsWith('../')) {
    newPath = './' + newPath;
  }

  if (os.platform() === 'win32') {
    var path = newPath.replace(/\//g, '\\');
    newPath = path.replace(/\\/g, '\\\\');
  }

  return newPath;
}
