const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './src/dialog.js'
  },
  output: {
    filename: 'js/dialog.min.js',
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: [
          path.resolve(__dirname, '../dist'),
          path.resolve(__dirname, '../node_modules'),
        ],
        use: [
          {
            loader: 'eslint-loader',
            /* options: {
              formatter: require('eslint-friendly-formatter')
            } */
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240
              // name: 'images/[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      inject: true
    })
  ]
}