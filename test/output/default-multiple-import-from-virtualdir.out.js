define(['underscore'], function(underscore) {
  'use strict';

  var random = underscore.random;

  var defaultMultipleImportFromVirtualdir = {
    id: underscore.uniqueId(),
    rand: random()
  };

  return defaultMultipleImportFromVirtualdir;

});
