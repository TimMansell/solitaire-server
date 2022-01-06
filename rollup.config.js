import path from 'path';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import alias from '@rollup/plugin-alias';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';

const projectRootDir = path.resolve(__dirname);

export default {
  input: {
    index: './src/main.js',
    stats: './src/tasks/stats.js',
  },
  output: {
    dir: 'dist',
    entryFileNames: '[name].js',
    format: 'cjs',
  },
  plugins: [
    alias({
      entries: [
        { find: '@', replacement: path.resolve(projectRootDir, './src') },
      ],
    }),
    commonjs(),
    nodeResolve({
      preferBuiltins: true,
      extensions: ['.js'],
    }),
    json(),
    terser(),
  ],
};
