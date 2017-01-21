const path = require('path');
const webpack = require('webpack');
const BitBarWebpackProgressPlugin = require('bitbar-webpack-progress-plugin');

const packageInfo = require('./package.json');

module.exports = function (env) {

  let uglifyPlugin;

  if (env.minimize) {
    uglifyPlugin = [new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: true
      }
    })];
  } else {
    uglifyPlugin = [];
  }

  return {
    entry: ['babel-polyfill', 'whatwg-fetch', './src/avg.js'],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: `avg${env.minimize ? '.min' : ''}.js`,
      libraryTarget: 'umd',
      library: 'AVG',
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: ['src', 'node_modules'],
    },
    module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules\/(?!koa-compose)/, loader: 'babel-loader', query: { compact: true } },
        { test: /\.jsx$/, exclude: /node_modules/, loader: 'babel-loader', query: { compact: true } },
        { test: /\.(glsl|frag|vert)$/, loader: 'raw-loader', exclude: /node_modules/ },
      ],
    },
    externals: {
      'pixi.js': 'PIXI',
    },
    devtool: 'source-map',
    plugins: [
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(packageInfo.version),
        'process.env': {
          NODE_ENV: JSON.stringify(env.release ? 'production' : 'development'),
        },
      }),
      ...uglifyPlugin,
      new BitBarWebpackProgressPlugin(),
    ]
  };
};
