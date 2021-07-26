import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";
//import { terser } from "rollup-plugin-terser";
//import { uglify } from "rollup-plugin-uglify";

const input = 'src/index.ts';
const output = 'build/index';
const extensions = ['.js', '.ts', '.tsx'];

const globals = {
  'react': 'React',
  'react-dom': 'ReactDOM'
}

const externalLibs = [
  'react',
  'react-dom'
]

export default [
  {
    input: input,
    output: {
      file: `${output}.js`,
      format: 'cjs',
      globals
    },
    external: externalLibs,
    plugins: [
      resolve({
        browser: true,
        extensions
      }),
      commonjs({
        include: [
          'node_modules/**'
        ]
      }),
      babel({
        extensions,
        exclude: "node_modules/**"
      }),
      external(),
      //uglify(),
    ],
  },
  {
    input: input,
    output: {
      name: 'react-view-splitter',
      file: `${output}.umd.js`,
      format: 'umd',
      globals
    },
    external: externalLibs,
    plugins: [
      resolve({
        extensions
      }),
      commonjs({
        include: [
          'node_modules/**'
        ]
      }),
      external(),
      babel({
        extensions,
        exclude: "node_modules/**"
      }),
      //terser(),
    ],
  }, {
    input: input,
    output: {
      file: `${output}.es.js`,
      format: 'es',
      globals
    },
    external: externalLibs,
    plugins: [
      resolve({
        extensions
      }),
      commonjs({
        include: [
          'node_modules/**'
        ]
      }),
      babel({
        extensions,
        exclude: "node_modules/**"
      }),
      external(),
      //terser(),
    ],
  },

]