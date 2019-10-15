import _ from 'underscore';
import localModule from './localDefaultModule';

export default {
  callLog: txt => {
    localModule.log(txt);
  },

  repeat: (n, cb) => {
    return _.times(n, cb);
  }
};
