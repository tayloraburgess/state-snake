import babel from 'rollup-plugin-babel';

const dir = process.env.BUILD === 'production' ? 'lib' : 'temp';

export default {
  entry: 'src/client/js/main.js',
  dest: `${dir}/client/main.js`,
  plugins: [ babel() ],
  format: 'umd'
}
