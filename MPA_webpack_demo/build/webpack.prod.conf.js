process.env.NODE_ENV = 'production';

// 注：如果在页面中使用到了编译的依赖会导致 chunkhash 使用不了

const path = require('path'); // 路径管理插件（node的插件，直接使用）
const merge = require('webpack-merge');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 打包前清除之前的文件
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 用新生成的 index.html 文件替换原来的 index.html
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // 提取相应的代码生成单独的文件（如css）
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin'); // 压缩 css 文件
const CopyWebpackPlugin = require('copy-webpack-plugin'); // 复制静态文件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // 压缩 js 文件
const baseWebpackConfig = require('./webpack.base.conf');
const config = require('../config');
const utils = require('./utils');
// const FileListPlugin = require('../webpack_plugin_test/FileListPlugin'); // 自定义的插件

const prodWebpackConfig = merge(baseWebpackConfig, {
  // entry: { // 入口起点
  //   app: './src/main.js', // 入口1
  //   // test: './src/test.js' // 入口2 用于多页开发
  // },
  output: {
    path: config.build.assetsRoot, // 目标输出目录 path 的绝对路径
    filename: utils.assetsPath('js/[name].[chunkhash].js'), // 输出文件的文件名
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js'), // 决定了非入口(non-entry) chunk 文件的名称
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
    })
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/prod.env'), // 此环境变量用于生产环境页面（编译过程不生效）
    }),
     // 打包前清除之前的文件(需要重置根目录) 注：build.js 已经删除了 static 目录，所以这里没有必要再次删除了
    // new CleanWebpackPlugin(['dist/static/', 'dist/*.*'], { root: path.resolve(__dirname, '..') }),
    new UglifyJsPlugin({ // 压缩 js 文件
      uglifyOptions: {
        compress: {
          warnings: false,
        }
      },
      sourceMap: config.build.productionSourceMap, // 使用 source map 将错误信息的位置映射到模块，默认为 false
      parallel: true, // 使用多进程并行运行和文件缓存来提高构建速度，默认为 false
    }),
    // new HtmlWebpackPlugin({ // 用新生成的 index.html 文件替换原来的 index.html（见下面介绍）
    //   // title: 'Output Management',
    //   filename: config.build.index,
    //   template: 'index.html',
    //   inject: true, // 是否要把所有的资产注入到给定的 html 中
    //   minify: { // 传递HTML-minifier的选项对象来缩小输出
    //     removeComments: true, // 去除注释
    //     collapseWhitespace: true, // 去掉空格
    //     removeAttributeQuotes: true, // 去掉引用
    //     // more options:
    //     // https://github.com/kangax/html-minifier#options-quick-reference
    //   },
    //   // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    //   chunksSortMode: 'dependency', // 块的排序方式依靠依赖的顺序进行排序
    // }),
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
    // new webpack.optimize.CommonsChunkPlugin({ // 提出公共代码放置到公共文件中
    //   name: 'common', // Specify the common bundle's name.
    // }),
    // extract css into its own file
    new ExtractTextPlugin({ // 生成独立的 css 文件
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // set the following option to `true` if you want to extract CSS from
      // codesplit chunks into this main css file as well.
      // This will result in *all* of your app's CSS being loaded upfront.
      allChunks: false,
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({ // 压缩 css
      // cssProcessorOptions: {
      //   safe: true
      // }
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true },
    }),
    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor'],
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3,
    }),
    // copy custom static assets
    new CopyWebpackPlugin([ // 复制静态文件
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory, // 相对于 assetRoot 目录
        ignore: ['.*'],
      }
    ]),
    // new FileListPlugin(), // 自定义的插件
   ],
});

if (config.build.productionGzip) { // 是否需要压缩文件（不能压缩目录，只能压缩文件）
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  prodWebpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]', // 目标资源名称，[file] 会被替换成原始资源，[path] 会被替换成原始资源的路径，[query] 会被替换成查询字符串。默认为 [path].gz[query]
      algorithm: 'gzip', // 压缩方式，默认为 gzip
      test: new RegExp( // 哪些文件需要压缩（默认为所有文件）
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240, // 超过该限值才会被压缩处理，默认为 0 bytes
      minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理，默认为 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) { // 是否需要打包分析报告
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  prodWebpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = prodWebpackConfig;
