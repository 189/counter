var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: {
    	app : path.join(__dirname, 'index.js'),
        vendors: ['react', 'redux']
    },

    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].js'
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                test : /.css$/,
                loader : 'style!css'
            },
            {
                test: /\.scss$/,
                loaders: ["sass"]
            }

        ]
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
        new HtmlWebpackPlugin({
        	template: './_index.html',
        	filename: 'counter.html',
        	inject: 'body',
        	chunks: ['vendors','app']
        })
    ]
};
