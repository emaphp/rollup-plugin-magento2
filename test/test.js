const path = require('path');
const assert = require('assert');
const magento2 = require('../dist/rollup-plugin-magento2.cjs');

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
});
