define(['underscore'], function(_) {
  'use strict';

  var localModule = {
    log: function log(msg) {
      console.log(msg);
    }
  };

  var simpleLocalModuleImport = {
    callLog: function callLog(txt) {
      localModule.log(txt);
    },
    repeat: function repeat(n, cb) {
      return _.times(n, cb);
    }
  };

  return simpleLocalModuleImport;

});
