define(['underscore'], function(underscore) {
  'use strict';

  var random = underscore.random;

  var defaultMultipleImport = {
    id: underscore.uniqueId(),
    rand: random()
  };

  return defaultMultipleImport;

});
