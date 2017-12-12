process.env.NODE_ENV = 'production';

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

const prodWebpackConfig = merge(baseWebpackConfig, {
  entry: { // 入口起点
    app: './src/main.js', // 入口1
    // test: './src/test.js' // 入口2 用于多页开发
  },
  output: {
    path: config.build.assetsRoot, // 目标输出目录 path 的绝对路径
    filename: utils.assetsPath('js/[name].[chunkhash].js'), // 输出文件的文件名
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js'), // 注：如果在页面中使用到了编译的依赖会导致 chunkhash 使用不了
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
          warnings: false
        }
      },
      sourceMap: config.build.productionSourceMap,
      parallel: true
    }),
    new HtmlWebpackPlugin({ // 用新生成的 index.html 文件替换原来的 index.html（见下面介绍）
      // title: 'Output Management',
      filename: config.build.index, // 输出到指定的目录下
      template: 'index.html', // 是指根目录下的 index.html 文件
      inject: true, // 是否要把所有的资产注入到给定的 html 中
      minify: { // 传递HTML-minifier的选项对象来缩小输出
        removeComments: true, // 去除注释
        collapseWhitespace: true, // 去掉空格
        removeAttributeQuotes: true, // 去掉引用
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency', // 块的排序方式依靠依赖的顺序进行排序
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
        // console.log('module==', module);
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
      chunks: ['vendor']
    }),
    // copy custom static assets
    new CopyWebpackPlugin([ // 复制静态文件
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),
   ],
});

if (config.build.productionGzip) { // 是否添加压缩文件
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  prodWebpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]', // 地址
      algorithm: 'gzip', // 压缩方式
      test: new RegExp( // 哪些需要压缩
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240, // 最大限值
      minRatio: 0.8, // 压缩比例
    })
  )
}

if (config.build.bundleAnalyzerReport) { // 是否需要打包分析报告
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  prodWebpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = prodWebpackConfig;
