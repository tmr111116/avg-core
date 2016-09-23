const path = require('path');
// var webpack = require('webpack');

module.exports = {
  entry: {
    avg: ['babel-polyfill', 'whatwg-fetch', './src/avg.js'],
    index: './example/entry.jsx',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
    chunkFilename: '[name].min.js',
    libraryTarget: 'umd',
    library: 'AVG',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['src', 'node_modules'],
  },
  externals: {  // 指定采用外部 CDN 依赖的资源，不被webpack打包
    'avg.js': 'AVG',
  },
  // plugins: [
  //   new  webpack.optimize.CommonsChunkPlugin('common.js', ['iceleaf', 'index'])
  // ],
  module: {
    postLoaders: [
      {
        include: path.resolve(__dirname, 'node_modules', 'pixi.js'),
        loader: 'transform/cacheable?brfs',
      },
    ],
    loaders: [
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.js$/, exclude: /node_modules/, loaders: ['babel-loader'] },
      { test: /\.jsx$/, exclude: /node_modules/, loaders: ['babel-loader'] },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.(glsl|frag|vert)$/, loader: 'raw', exclude: /node_modules/ },
      { test: /\.(glsl|frag|vert)$/, loader: 'glslify', exclude: /node_modules/ },
      { test: path.resolve(__dirname, 'node_modules', 'pixi.js'), loader: 'ify' },
    ],
  },
  devServer: {
    contentBase: './example',
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
  },
};
