// 'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path');

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/uploadFile': {
        // target: 'http://192.144.229.202:8081',
        target: 'http://123.57.203.185:8088',
        // changeOrigin: true // 是否在本机创建target地址的虚拟服务，避免跨域问题
      },
      '/user': {
        // target: 'http://192.144.229.202:8081',
        target: 'http://123.57.203.185:8081',
        // changeOrigin: true // 是否在本机创建target地址的虚拟服务，避免跨域问题
      },
      '/sendEmail': {
        // target: 'http://192.144.229.202:8081',
        target: 'http://123.57.203.185:8081',
        // changeOrigin: true // 是否在本机创建target地址的虚拟服务，避免跨域问题
      },
      '/login': {
        // target: 'http://192.144.229.202:8081',
        target: 'http://123.57.203.185:8081',
        // changeOrigin: true // 是否在本机创建target地址的虚拟服务，避免跨域问题
      },
      '/register': {
        // target: 'http://192.144.229.202:8081',
        target: 'http://123.57.203.185:8081',
        // changeOrigin: true // 是否在本机创建target地址的虚拟服务，避免跨域问题
      },
      '/group': {
        // target: 'http://192.144.229.202:8081',
        target: 'http://123.57.203.185:8081',
        // changeOrigin: true // 是否在本机创建target地址的虚拟服务，避免跨域问题
      },
      '/mes': {
        // target: 'http://192.144.229.202:8081',
        target: 'http://123.57.203.185:8081',
        // changeOrigin: true // 是否在本机创建target地址的虚拟服务，避免跨域问题
      },
      '/friend': {
        // target: 'http://192.144.229.202:8081',
        target: 'http://123.57.203.185:8081',
        // changeOrigin: true // 是否在本机创建target地址的虚拟服务，避免跨域问题
      },
      '/expre': {
        target: 'http://123.57.203.185:8088',
        // changeOrigin: true // 是否在本机创建target地址的虚拟服务，避免跨域问题
      },
      // '/display': {
      //   target: 'http://123.57.203.185:8088',
      //   // changeOrigin: true // 是否在本机创建target地址的虚拟服务，避免跨域问题
      // },
      '/api': {
        target: 'http://api.budejie.com',
        changeOrigin: true // 是否在本机创建target地址的虚拟服务，避免跨域问题
      },
      '/touch': {
        target: 'https://3g.163.com',
        changeOrigin: true // 是否在本机创建target地址的虚拟服务，避免跨域问题
      }
    },

    // Various Dev Server settings
    host: '127.0.0.1', // can be overwritten by process.env.HOST
    port: 8899, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../../chatServer/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../../chatServer/public'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
