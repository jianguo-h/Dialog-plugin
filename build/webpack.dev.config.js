const webpack = require('webpack');
const { merge } = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackDevConfig = merge(webpackBaseConfig, {
  devtool: 'eval-cheap-module-source-map',
  mode: 'development',
  output: {
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: true,
    }),
  ],
});

module.exports = webpackDevConfig;
