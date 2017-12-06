const merge = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 用新生成的 index.html 文件替换原来的 index.html
const baseWebpackConfig = require('./webpack.base.conf');
const config = require('../config');
const utils = require('./utils');

module.exports = merge(baseWebpackConfig, {
  // devtool: 'inline-source-map', // 用于追踪到错误和警告在源代码中的原始位置（注：inline-source-map不要用于生产环境）
  output: {
    publicPath: config.dev.assetsPublicPath,
  },
  devtool: '#cheap-module-eval-source-map',
  devServer: { // 自动刷新浏览器（使用 webpack-dev-server 插件）
    contentBase: './dist',
    hot: true, // 支持热更新(只更新改动的文件部分，而不是所有的文件重新构建)
    port: config.dev.port, // 端口
  },
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
   plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env,
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
   ],
})
