const merge = require('webpack-merge'); // webpack 合并配置插件
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 用新生成的 index.html 文件替换原来的 index.html
const portfinder = require('portfinder');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin'); // 友好提示插件
const baseWebpackConfig = require('./webpack.base.conf');
const config = require('../config');
const utils = require('./utils');

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

const devWebpackConfig = merge(baseWebpackConfig, {
  output: {
    publicPath: config.dev.assetsPublicPath,
  },
  devtool: config.dev.devtool, // 用于追踪到错误和警告在源代码中的原始位置
  devServer: { // 前端服务配置（使用 webpack-dev-server 插件）
    // contentBase: './dist', // 告诉服务器从哪里提供内容,只有在想要提供静态文件时才需要, 但是 publicPath 属性优先
    clientLogLevel: 'warning', // 模块热替换（热模块更换）启用时显示控制台的信息级别，有 none、error、warning 和 info 供选择还用
    historyApiFallback: true, // 为 true 时，当使用 HTML5 History API 时，任意的 404 响应都会被替代为 index.html
    hot: true, // 支持热更新(只更新改动的文件部分，而不是所有的文件重新构建) 注：只有添加 new webpack.HotModuleReplacementPlugin() 插件才能生效）
    compress: true, // 一切服务都启用 gzip 压缩
    host: HOST || config.dev.host, // 域名
    port: PORT || config.dev.port, // 端口
    open: config.dev.autoOpenBrowser, // 是否默认打开浏览器
    overlay: config.dev.errorOverlay // 当编译器有错误或警告时是否需要浏览器全屏覆盖显示。默认为 false
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath, // 此路径下的打包文件可在浏览器中访问
    proxy: config.dev.proxyTable, // 代理
    quiet: true, // necessary for FriendlyErrorsPlugin（日志信息显示）除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自的WebPack的错误或警告在控制台不可见
    watchOptions: {
      poll: config.dev.poll, // 是否使用轮询
      // ignored: /node_modules/, // 对于某些系统，监听大量文件系统会导致大量的 CPU 或内存占用。这个选项可以排除一些巨大的文件夹
    },
    // inline 模式一般用于单页面应用开发，会自动将 socket 注入到页面代码中，多页模式一般设置为 false
    // inline: true,
    // allowedHosts: ['subdomain2.host.com', '.host3.com', '.testhost.com'],
    // https: false, // 启用 https（此时 http 失效）默认 false
  },
  module: {
    rules: [
      ...utils.styleLoaders({ sourceMap: config.dev.cssSourceMap }),
    ],
  },
   plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env'), // 此环境变量用于开发环境页面（编译过程不生效）
    }),
    new webpack.HotModuleReplacementPlugin(), // 模块热替换（这样 devServer 中的 hot: true 才能生效）
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: 'index.html',
    //   inject: true
    // }),
   ],
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => { // 保证一个空闲的端口可用
    if (err) {
      reject(err);
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port;
      // add port to devServer config
      devWebpackConfig.devServer.port = port;

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({ // 友好提示插件
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined,
      }))

      resolve(devWebpackConfig);
    }
  })
})
