import _ from 'underscore';
import { debounce } from 'underscore';

const localFunc = () => console.log('hello world');

export default {
  myFunc: debounce(localFunc)
};
