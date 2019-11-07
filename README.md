# rollup-plugin-magento2

Simple ES module bundling for Magento 2.

## About

This is a plugin for [Rollup](https://rollupjs.org/) that converts your Javascript modules written in ES6/ES7 to modules compatible with RequireJS.

## How it works

This plugin works by virtualizing modules that correspond to scripts already included on Magento 2 (ex: `jquery`, `underscore`, etc.). Each virtual plugin will be listed as an additional dependency on the `define` callback. The final result is a script compatible with RequireJS that can be easily deployed in Magento 2.

## Examples

### Simple module

This example shows how to declare `underscore` as a virtual module. When a module is declared as virtual, the plugin will append it to the dependency list.

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

**Result**

```javascript
define(['underscore'], function(_) {
  'use strict';

  var rollup = "Rollup & Magento";
  var message = "Hello from ".concat(_.escape(rollup), "!!!");
  alert(message);
});
```

### Local import

**main.js**

```javascript
// File assets/js/main.js
import sayHello from './sayHello';
import { debounce } from 'underscore';

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

**Result**

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

### Virtual directory

In case your module requires a lof of dependencies you can instead define a *virtual directory*. Any import prefixed with that name will be considered a Magento Javascript module.

**main.js**

```javascript
// File assets/js/main.js
import $ from '@magento/jquery';
import { random } from '@magento/underscore';

export default {
  trim: $.trim,
  rand: random
};
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
      virtualDir: 'magento'
    }),
  ]
};
```

**Result**

```javascript
define(['jquery', 'underscore'], function($, underscore) {
  'use strict';

  var random = underscore.random;

  var bundle = {
    trim: $.trim,
    rand: random
  };

  return bundle;
});
```

## Changelog

 * v1.0: Added: Support for *virtualDir*.
 * v0.1.1: Tests.
 * v0.1.0: First release.

## License

[MIT](LICENSE)
