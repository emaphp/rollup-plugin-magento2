define(['jquery', 'underscore'], function($,underscore) {
  'use strict';

  var random = underscore.random;

  var mixedImports = {
    trim: $.trim,
    rand: random()
  };

  return mixedImports;

});
