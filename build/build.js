const webpack = require('webpack');
const webpackProdConfig = require('./webpack.prod.config');

console.log('building for production...\n');
webpack(webpackProdConfig, (err, stats) => {
  if (err || stats?.hasErrors()) {
    process.stdout.write(
      stats?.toString({
        errors: true,
        errorDetails: true,
        errorStack: true,
        warnings: true,
        colors: true,
        assets: false,
        chunks: false,
        modules: false,
      }) ?? ''
    );
    console.log('Build failed');
    throw err;
  }

  process.stdout.write(
    stats?.toString({
      builtAt: false,
      timings: false,
      colors: true,
      assetsSort: 'size',
      chunksSort: 'size',
      version: true,
      excludeAssets: /media/,
    }) + '\n\n'
  );

  console.log('Build complete \n');
  console.log(
    'Tip: built files are meant to be served over an HTTP server.\n' +
      "Opening index.html over file:// won't work.\n"
  );
});
