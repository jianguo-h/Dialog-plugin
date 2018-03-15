const webpack = require('webpack');
const webpackProdConfig = require('./webpack.prod.config');

webpack(webpackProdConfig, (err, stats) => {
  if(err) {
    throw err;
  }
});