var webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    mode: 'production', // none, development
    entry: __dirname + '/index.js',
    output: {
        path: __dirname + '/dist',
        filename: 'live2d4vue.min.js',
        library: 'live2d4vue',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        less: 'vue-style-loader!css-loader!less-loader'
                    }
                }
            },{
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ],
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};
