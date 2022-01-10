import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackDevConfig from './webpack.dev.config';
import detectPort from 'detect-port';

const options: WebpackDevServer.Configuration = {
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
