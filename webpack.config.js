const path = require('path');
const webpack = require('webpack');
const BitBarWebpackProgressPlugin = require('bitbar-webpack-progress-plugin');

module.exports = {
  entry: {
    avg: ['babel-polyfill', 'whatwg-fetch', './src/avg.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].min.js',
    libraryTarget: 'umd',
    library: 'AVG',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['src', 'node_modules'],
  },
  resolveLoader: {
    fallback: [path.join(__dirname, 'node_modules')],
  },
  module: {
    postLoaders: [
      {
        include: path.resolve(__dirname, 'node_modules', 'pixi.js'),
        loader: 'transform/cacheable?brfs',
      },
    ],
    loaders: [
      { test: /\.js$/, exclude: /node_modules\/(?!koa-compose)/, loader: 'babel-loader', query: { compact: true } },
      { test: /\.jsx$/, exclude: /node_modules/, loader: 'babel-loader', query: { compact: true } },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.(glsl|frag|vert)$/, loader: 'raw', exclude: /node_modules/ },
      { test: /\.(glsl|frag|vert)$/, loader: 'glslify', exclude: /node_modules/ },
      { test: path.resolve(__dirname, 'node_modules', 'pixi.js'), loader: 'ify' },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require("./package.json").version)
    }),
    new BitBarWebpackProgressPlugin(),
  ],
  devServer: {
    contentBase: './example',
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
  },
};
