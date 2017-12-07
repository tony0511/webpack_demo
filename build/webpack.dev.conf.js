const merge = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 用新生成的 index.html 文件替换原来的 index.html
const portfinder = require('portfinder');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.conf');
const config = require('../config');
const utils = require('./utils');

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  // devtool: 'inline-source-map', // 用于追踪到错误和警告在源代码中的原始位置（注：inline-source-map不要用于生产环境）
  output: {
    publicPath: config.dev.assetsPublicPath,
  },
  devtool: config.dev.devtool,
  devServer: { // 前端服务器（使用 webpack-dev-server 插件）
    // contentBase: './dist',
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true, // 支持热更新(只更新改动的文件部分，而不是所有的文件重新构建)
    compress: true,
    host: HOST || config.dev.host, // 域名
    port: PORT || config.dev.port, // 端口
    open: config.dev.autoOpenBrowser, // 是否默认打开
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable, // 代理
    // quiet: true, // necessary for FriendlyErrorsPlugin（日志信息显示）
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
   plugins: [
    // new webpack.DefinePlugin({
    //   'process.env': config.dev.env,
    // }),
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env'),
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
   ],
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
