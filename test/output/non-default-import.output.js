define(['underscore'], function(_) {
  'use strict';

  var debounce = _.debounce;

  const localFunc = () => console.log('hello world');

  var nonDefaultImport = {
    myFunc: debounce(localFunc)
  };

  return nonDefaultImport;

});
