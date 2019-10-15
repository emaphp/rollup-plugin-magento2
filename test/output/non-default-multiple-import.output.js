define(['underscore'], function(_) {
  'use strict';

  var random = _.random;

  var nonDefaultMultipleImport = {
    id: _.uniqueId(),
    rand: random()
  };

  return nonDefaultMultipleImport;

});
