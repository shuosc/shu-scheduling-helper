const WorkerPlugin = require('worker-plugin');

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://xk.shuosc.com',
        changeOrigin: true,
      },
    },
  },
  configureWebpack: {
    plugins: [
      new WorkerPlugin({
        globalObject: 'self',
      }),
    ],
  },
  pages: {
    index: {
      entry: 'src/pages/index/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
    mobile: {
      entry: 'src/pages/mobile/main.js',
      template: 'public/mobile.html',
      filename: 'mobile.html',
      chunks: ['chunk-vendors', 'chunk-common', 'mobile'],
    },
    'quick-inputting': {
      entry: 'src/pages/quick-inputting/main.js',
      template: 'public/quick-inputting.html',
      filename: 'quick-inputting.html',
      chunks: ['chunk-vendors', 'chunk-common', 'quick-inputting'],
    },
    redirect: {
      entry: 'src/pages/redirect/main.js',
      template: 'public/redirect.html',
      filename: 'redirect.html',
      chunks: ['chunk-vendors', 'chunk-common', 'redirect'],
    },
  },
};
