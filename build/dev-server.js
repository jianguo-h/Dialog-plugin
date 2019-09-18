const path = require('path');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const webpackDevConfig = require('./webpack.dev.config');
const port = 8080;
const url = 'http://localhost:' + port;

Object.keys(webpackDevConfig.entry).forEach(entryName => {
  webpackDevConfig.entry[entryName] = ['webpack-dev-server/client?' + url, 'webpack/hot/dev-server'].concat(webpackDevConfig.entry[entryName]);
});

const compiler = webpack(webpackDevConfig);
const server = new webpackDevServer(compiler, {
  hot: true,
  disableHostCheck: true,		// 允许使用ip访问
  open: true,
  stats: {
    colors: true
  }
});

server.listen(port, () => {
  console.log('> Listening at ' + url);
});