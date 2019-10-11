import resolve from 'rollup-plugin-node-resolve';
import pkg from './package.json';

export default {
	input: 'src/index.js',
	plugins: [resolve()],
	external: ['path'],
	output: [
		{
      file: pkg.main,
      format: 'cjs'
    },
		{
      file: pkg.module,
      format: 'es'
    }
	]
};
