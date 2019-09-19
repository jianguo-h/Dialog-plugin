const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const webpackDevConfig = require('./webpack.dev.config');
const port = 8080;
const url = 'http://localhost:' + port;

const options = {
  hot: true,
  disableHostCheck: true, // 允许使用ip访问
  open: true,
  stats: {
    colors: true
  }
};

webpackDevServer.addDevServerEntrypoints(webpackDevConfig, options);

const compiler = webpack(webpackDevConfig);

const server = new webpackDevServer(compiler, options);

server.listen(port, () => {
  console.log('> Listening at ' + url);
});
