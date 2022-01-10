import { merge } from 'webpack-merge';
import webpackBaseConfig from './webpack.base.config';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

const webpackProdConfig = merge(webpackBaseConfig, {
  devtool: false,
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader',
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'dialog.min.css',
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessorOptions: {
          discardComments: { removeAll: true },
          minifyFontValues: { removeQuotes: false },
        },
        canPrint: true,
      }),
      new TerserPlugin({
        parallel: true,
        extractComments: false,
        terserOptions: {
          keep_fnames: false,
          keep_classnames: false,
          sourceMap: false,
          compress: {
            drop_console: true,
            drop_debugger: true,
            comparisons: false,
            inline: 2,
          },
          output: {
            ascii_only: true,
            comments: false,
          },
        },
      }),
    ],
  },
});

export default webpackProdConfig;
