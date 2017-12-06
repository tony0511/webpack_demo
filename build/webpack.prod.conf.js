const path = require('path'); // 路径管理插件
const merge = require('webpack-merge');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 打包前清除之前的文件
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 用新生成的 index.html 文件替换原来的 index.html
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.conf');
const config = require('../config');
const utils = require('./utils');

module.exports = merge(baseWebpackConfig, {
  entry: { // 入口起点
    app: './src/index.js', // 入口1
    // test: './src/test.js' // 入口2 用于多页开发
  },
  output: {
    publicPath: config.build.assetsPublicPath,
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
    })
  },
  plugins: [
    new CleanWebpackPlugin(['dist/static/', 'dist/*.*'], { root: path.resolve(__dirname, '..') }), // 打包前清除之前的文件(需要重置根目录)
    new webpack.DefinePlugin({
      'process.env': config.build.env,
    }),
    new HtmlWebpackPlugin({ // 用新生成的 index.html 文件替换原来的 index.html
      title: 'Output Management',
      filename: config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency',
      /*
      HtmlWebpackPlugin 配置：
        title：用于生成的HTML文档的标题。
        filename：将HTML写入的文件。默认为index.html。你也可以在这里指定一个子目录（例如：）assets/admin.html。
        template：Webpack需要路径到模板。有关详细信息，请参阅文档。
        inject：true | 'head' | 'body' | false注入所有的资产到给定template或templateContent- 当传递true或'body'所有JavaScript资源将被放置在身体元素的底部。'head'将脚本放在head元素中。
        favicon：将给定的图标路径添加到输出html。
        minify：{...} | false传递HTML-minifier的选项对象来缩小输出。
        hash：true | false如果true然后附加一个独特的webpack编译哈希到所有包含的脚本和CSS文件。这对缓存清除非常有用。
        cache：true | false如果true（默认）尝试仅在文件被更改时才发出文件。
        showErrors：true | false如果true（默认）错误细节将被写入HTML页面。
        chunks：允许你只添加一些块（例如，只有单元测试块）
        chunksSortMode：允许在包含到html之前控制如何对块进行排序。允许的值：'none'| 'auto'| 'dependency(依赖)'|'manual(手动)'| {function} - 默认：'auto'
        excludeChunks：允许你跳过一些块（例如，不要添加单元测试块）
        xhtml：true | false如果true将link标签呈现为自动关闭，则符合XHTML。默认是false
      */
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   // sourceMap 方便 debug 和运行基准测试，webpack 可以在 bundle 中生成内联的 source map 或生成到独立文件。
    //   // sourceMap: options.devtool && (options.devtool.indexOf("sourcemap") >= 0 || options.devtool.indexOf("source-map") >= 0),
    //   sourceMap: true,
    // }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   },
    //   sourceMap: true
    // }),
    new webpack.optimize.CommonsChunkPlugin({ // 提出公共代码放置到公共文件中
      name: 'common', // Specify the common bundle's name.
    }),
    // extract css into its own file
    new ExtractTextPlugin({ // 生成独立的 css 文件
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
   ],
})
