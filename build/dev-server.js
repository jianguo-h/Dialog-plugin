const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackDevConfig = require('./webpack.dev.config');
const detectPort = require('detect-port');
const path = require('path');

const options = {
  historyApiFallback: true,
  open: true,
  hot: true,
  liveReload: true,
  client: {
    overlay: {
      warnings: false,
      errors: true,
    },
  },
};

let port = 8080;
const compiler = webpack(webpackDevConfig);

async function startDevServer() {
  const _port = await detectPort(port);
  if (_port === port) {
    options.port = port;
    const server = new WebpackDevServer(options, compiler);
    await server.start();
    return;
  }
  port += 1;
  await startDevServer();
}

startDevServer();
