module.exports = {
    entry: "./entry.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
    	postLoaders: [
            {
                loader: "transform/cacheable?brfs"
            }
        ],
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
            { test: /\.json$/, loader: 'json-loader'},

        ]
    },
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
    }
};