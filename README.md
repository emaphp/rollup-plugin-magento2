# rollup-plugin-magento2

Simple ES module bundling for Magento 2.

**WARNING**: This plugin is purely experimental and should not be used in production environments.

## About

This is a plugin for [Rollup](https://rollupjs.org/) that converts your Javascript modules written in ES6/ES7 to modules compatible with RequireJS.

## How it works

This plugin works by virtualizing modules that correspond to modules already included on Magento 2 (ex: `jquery`, `underscore**, etc.**. You still need to specify which modules are virtual though. The final result is a script compatible with RequireJS that can be easily deployed in Magento 2.

## Examples

### Simple module

**main.js**

```javascript
// File: assets/js/main.js
import $ from 'jquery';

const rollup = "Rollup";
const message = `   Hello from ${rollup}!!!   `;
alert($.trim(message));
```

**rollup.config.js**

```javascript
// File: rollup.config.js
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import magento2 from 'rollup-plugin-magento2;

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
        'jquery'
      ]
    }),
  ]
};
```

Result:

```javascript
define(['jquery'], function($) {
  'use strict';

  var rollup = "Rollup";
  var message = "   Hello from ".concat(rollup, "!!!   ");
  alert($.trim(message));
});
```

### Local import

**sayHello.js**

```javascript
// File assets/js/sayHello.js
const sayHello = message => alert( message );
export default sayHello;
```

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

**rollup.config.js**

```javascript
// File: rollup.config.js
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import magento2 from 'rollup-plugin-magento2;

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

  var local_import = {
    sayHello: debounce(sayHello, 300)
  };

  return local_import;
});
```

## TODOs

 * Add tests.

## Changelog

 * v0.1.0: First release.

## License

[MIT](LICENSE)
