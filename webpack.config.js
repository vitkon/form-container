const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');

const config = {
    entry: ['./src/main.ts'],
    output: {
        libraryTarget: 'commonjs-module',
        path: path.join(__dirname, 'dist'),
        filename: 'index.js'
    },
    // Add resolve for `tsx` and `ts` files, otherwise Webpack would
    // only look for common JavaScript file extension (.js)
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    // Activate source maps for the bundles in order to preserve the original
    // source when the user debugs the application
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new DtsBundlePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true
            },
            output: {
                comments: false
            }
        }),
        new CompressionPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
            threshold: 10240,
            minRatio: 0.8
        })
    ],
    module: {
        // Webpack doesn't understand TypeScript files and a loader is needed.
        // `node_modules` folder is excluded in order to prevent problems with
        // the library dependencies, as well as `__tests__` folders that
        // contain the tests for the library
        loaders: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },

    externals: {
        react: 'commonjs react',
        'react-dom': 'commonjs react-dom'
    }
};

module.exports = config;

function DtsBundlePlugin() {}
DtsBundlePlugin.prototype.apply = function(compiler) {
    compiler.plugin('done', function() {
        var dts = require('dts-bundle');

        dts.bundle({
            name: 'form-container',
            main: 'dist/ts-build/main.d.ts',
            out: '../index.d.ts',
            removeSource: false // these are needed to --watch
        });
    });
};
