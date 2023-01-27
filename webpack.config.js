const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: ['./index.ts', './style.css'],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.css$/i,
                use: [
                    // "style-loader",
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ],
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/icons/[hash][ext][query]'
                }
            },
            {
                test: /\.(svg)$/i,
                loader: 'svg-inline-loader'
            }
        ],
    },
    mode: 'development',
    plugins: [
        new CleanWebpackPlugin(),
        // ??
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'index.html'),
        }),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.css'],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    }
};
