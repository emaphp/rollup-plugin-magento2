define(['underscore'], function(_) {
  'use strict';

  var random = _.random;

  var nonDefaultMultipleImportFromVirtualdir = {
    id: _.uniqueId(),
    rand: random()
  };

  return nonDefaultMultipleImportFromVirtualdir;

});
