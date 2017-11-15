import resolve from 'rollup-plugin-node-resolve'
import uglify from 'rollup-plugin-uglify'
import {minify} from 'uglify-es'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/zx-app.umd.js',
    sourcemap: true,
    format: 'iife',
    name: 'zxState'
  },
  plugins: [
    resolve({ jsnext: true, module: true }),
    uglify({mangle: true, compress: true}, minify),
  ]
}