const path = require('path');
const fs = require('fs');
const assert = require('assert');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const magento2 = require('../dist/rollup-plugin-magento2.cjs');
const { rollup } = require('rollup');

const getModuleIdsFromBundle = (bundle) => {
  if (bundle.modules) {
    return Promise.resolve(bundle.modules.map(module => module.id));
  }
  return bundle.generate({ format: 'esm' }).then((generated) => {
    if (generated.output) {
      return generated.output.length ? generated.output : Object.keys(generated.output)
        .map(chunkName => generated.output[chunkName]);
    }
    return [generated];
  }).then(chunks => chunks
          .reduce((moduleIds, chunk) => moduleIds.concat(Object.keys(chunk.modules)), []));
};

const normalizeGeneratedSource = source => source.replace(/(\r\n|\n|\r)/gm, '').replace(/\t/gm, '');

describe('rollup-plugin-magento2', () => {
	it('can resolve virtual module', () => {
    const plugin = magento2({
      virtual: [
        'jquery'
      ]
    });

		const resolved = plugin.resolveId('jquery');
    assert.equal(resolved, '\0magento2:jquery');
	});

  it('can translate single default import declaration', () => {
    return rollup({
      input: './test/files/default-single-import.js',
      plugins: [
        resolve(),
        commonjs(),
        magento2({
          virtual: [
            'underscore'
          ]
        })
      ],
    })
      .then(bundle => {
        return bundle.generate({
          format: 'iife',
          name: 'defaultSingleImport'
        });
      })
      .then(generated => {
        const actual = generated.output[0].code;
        const expected = fs.readFileSync('./test/output/default-single-import.output.js');
        return Promise.resolve(assert.equal(actual, expected));
      });
  });

  it('can translate single non-default import declaration', () => {
    return rollup({
      input: './test/files/non-default-single-import.js',
      plugins: [
        resolve(),
        commonjs(),
        magento2({
          virtual: [
            'underscore'
          ]
        })
      ],
    })
      .then(bundle => {
        return bundle.generate({
          format: 'iife',
          name: 'nonDefaultSingleImport'
        });
      })
      .then(generated => {
        const actual = generated.output[0].code;
        const expected = fs.readFileSync('./test/output/non-default-single-import.output.js');
        return Promise.resolve(assert.equal(actual, expected));
      });
  });

  it('can translate multiple default import declaration', () => {
    return rollup({
      input: './test/files/default-multiple-import.js',
      plugins: [
        resolve(),
        commonjs(),
        magento2({
          virtual: [
            'underscore'
          ]
        })
      ],
    })
      .then(bundle => {
        return bundle.generate({
          format: 'iife',
          name: 'defaultMultipleImport'
        });
      })
      .then(generated => {
        const actual = generated.output[0].code;
        const expected = fs.readFileSync('./test/output/default-multiple-import.output.js');
        return Promise.resolve(assert.equal(actual, expected));
      });
  });

  it('can translate multiple non-default import declaration', () => {
    return rollup({
      input: './test/files/non-default-multiple-import.js',
      plugins: [
        resolve(),
        commonjs(),
        magento2({
          virtual: [
            'underscore'
          ]
        })
      ],
    })
      .then(bundle => {
        return bundle.generate({
          format: 'iife',
          name: 'nonDefaultMultipleImport'
        });
      })
      .then(generated => {
        const actual = generated.output[0].code;
        const expected = fs.readFileSync('./test/output/non-default-multiple-import.output.js');
        return Promise.resolve(assert.equal(actual, expected));
      });
  });

  it('can translate simple local module import declaration', () => {
    return rollup({
      input: './test/files/simple-local-module-import.js',
      plugins: [
        babel(),
        resolve(),
        commonjs(),
        magento2({
          virtual: [
            'underscore'
          ]
        })
      ],
    })
      .then(bundle => {
        return bundle.generate({
          format: 'iife',
          name: 'simpleLocalModuleImport'
        });
      })
      .then(generated => {
        const actual = generated.output[0].code;
        const expected = fs.readFileSync('./test/output/simple-local-module-import.output.js');
        return Promise.resolve(assert.equal(actual, expected));
      });
  });
});
