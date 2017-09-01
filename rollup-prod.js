import resolve from 'rollup-plugin-node-resolve';
import closure from 'rollup-plugin-closure-compiler-js';

export default {
  input: './src/index.js',
  output: {
    file: 'public/game.min.js',
    format: 'iife',
  },
  plugins: [
    resolve(),
    closure(),
  ],
};
