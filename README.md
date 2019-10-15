# rollup-plugin-magento2

Simple ES module bundling for Magento 2.

## About

This is a plugin for [Rollup](https://rollupjs.org/) that converts your Javascript modules written in ES6/ES7 to modules compatible with RequireJS.

## How it works

This plugin works by virtualizing modules that correspond to modules already included in Magento 2 (ex: `jquery`, `underscore`, etc.). It does it by replacing the modules you declare as virtual with an additional argument to the `define` function. The final result is a script compatible with RequireJS that can be easily deployed in Magento 2.

## Examples

### Simple module

This example shows how to declare `underscore` as a virtual module. When a module is declared as virtual, the plugin will append it to the dependency list. The resulting script will also include it as an argument of the callback function.

**main.js**

```javascript
// File: assets/js/main.js
import _ from 'underscore';

const rollup = "Rollup & Magento";
const message = `Hello from ${_.escape(rollup)}!!!`;
alert(message);
```

**rollup.config.js**

```javascript
// File: rollup.config.js
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import magento2 from 'rollup-plugin-magento2';

export default {
  input: './assets/js/main.js',
  output: {
    file: './view/frontend/web/js/main.js',
    format: 'iife',
    name: 'bundle',
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    resolve(),
    commonjs(),
    magento2({
      virtual: [
        'underscore'
      ]
    }),
  ]
};
```

Result:

```javascript
define(['underscore'], function(_) {
  'use strict';

  var rollup = "Rollup & Magento";
  var message = "Hello from ".concat(_.escape(rollup), "!!!");
  alert(message);
});
```

### Local import

This example shows a simple local module and how to import by name from virtual modules.

**main.js**

```javascript
// File assets/js/main.js
import { debounce } from 'underscore';
import sayHello from './sayHello';

// Build a debounced version of sayHello
export default {
  sayHello: debounce(sayHello, 300)
};
```

**sayHello.js**

```javascript
// File assets/js/sayHello.js
const sayHello = message => alert( message );
export default sayHello;
```
**rollup.config.js**

```javascript
// File: rollup.config.js
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import magento2 from 'rollup-plugin-magento2';

export default {
  input: './assets/js/main.js',
  output: {
    file: './view/frontend/web/js/main.js',
    format: 'iife',
    name: 'bundle',
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    resolve(),
    commonjs(),
    magento2({
      virtual: [
        'underscore'
      ]
    }),
  ]
};
```

Result:

```javascript
define(['underscore'], function(underscore) {
  'use strict';

  var debounce = underscore.debounce;

  var sayHello = function sayHello(message) {
    return alert(message);
  };

  var bundle = {
    sayHello: debounce(sayHello, 300)
  };

  return bundle;
});
```

## TODOs

 * Support additional options.

## Changelog

 * v0.1.1: Tests.
 * v0.1.0: First release.

## License

[MIT](LICENSE)
