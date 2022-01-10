import { merge } from 'webpack-merge';
import webpackBaseConfig from './webpack.base.config';
import HtmlWebpackPlugin from 'html-webpack-plugin';

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

export default webpackDevConfig;
