import path from 'path';
import { Configuration } from 'webpack';

const baseConfig: Configuration = {
  entry: './src/index.ts',
  output: {
    filename: 'dialog.min.js',
    path: path.resolve(__dirname, '../dist'),
    assetModuleFilename: 'media/[name].[hash:8].[ext]',
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
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
};

export default baseConfig;
