var path = require('path');

module.exports = {
    entry: ['babel-polyfill', './test/entry.js'],
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        modulesDirectories: ["src", "node_modules"]
    },
    module: {
    	postLoaders: [
            {
                loader: "transform/cacheable?brfs"
            }
        ],
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.js$|jsx$/, exclude: /node_modules/, loader: "babel-loader"},
            { test: /\.json$/, loader: 'json-loader'},

        ]
    },
    devServer: {
        contentBase: "./test",
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
    }
};
