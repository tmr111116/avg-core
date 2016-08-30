var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        iceleaf: ['babel-polyfill', './src/Iceleaf.js'],
        index: './example/entry.js'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: "[name].js",
        chunkFilename: "[name].min.js",
        libraryTarget: 'umd',
        library: 'iceleaf'
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        modulesDirectories: ["src", "node_modules"]
    },
    externals: {    // 指定采用外部 CDN 依赖的资源，不被webpack打包
        "iceleaf": "iceleaf"
    },
    // plugins: [
    //     new  webpack.optimize.CommonsChunkPlugin('common.js', ['iceleaf', 'index'])
    // ],
    module: {
    	postLoaders: [
            {
                loader: "transform/cacheable?brfs"
            }
        ],
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
            { test: /\.jsx$/, exclude: /node_modules/, loaders: ["react-hot", "babel-loader"]},
            { test: /\.json$/, loader: 'json-loader'},

        ]
    },
    devServer: {
        contentBase: "./example",
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
    }
};
