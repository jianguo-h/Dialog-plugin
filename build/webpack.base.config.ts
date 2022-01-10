import path from 'path'
import { Configuration } from 'webpack';

const baseConfig: Configuration = {
  entry: './src/ts/dialog.ts',
  output: {
    filename: 'dialog.min.js',
    path: path.resolve(__dirname, '../dist'),
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'ts-loader'],
      },
      {
        exclude: [
          /\.(js|mjs|jsx|ts|tsx)$/,
          /\.html$/,
          /\.json$/,
          /\.(css|sass|scss|less)$/,
        ],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024 * 10,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
};

export default baseConfig
