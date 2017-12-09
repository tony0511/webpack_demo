const path = require('path'); // 路径管理插件
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 用新生成的 index.html 文件替换原来的 index.html
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 打包前清除之前的文件
const webpack = require('webpack');

function resolve (dir) { // 缩写目录
  return path.join(__dirname, '..', dir)
}

module.exports = { // webpack 基本配置导出
  /*
    entry: './path/to/my/entry/file.js', 等价于 entry: { main: './path/to/my/entry/file.js' },
  */
  // entry: './src/index.js', // 单个入口
  entry: { // 入口起点
    app: './src/index.js', // 入口1
    // print: './src/print.js' // 入口2 用于多页开发
  },
  output: { // 输出
    filename: '[name].bundle.js', // 输出文件的文件名
    /*
      [name]：使用入口名称
      [id]：使用内部 chunk id
      [hash]：使用每次构建过程中，唯一的 hash 生成
      [chunkhash]：使用基于每个 chunk 内容的 hash
      [query]：模块的 query，例如，文件名 ? 后面的字符串
      -> [hash:16]：指定长度16（默认为20）
      =============================================
      [absolute-resource-path]：绝对路径文件名
      [all-loaders]：自动和显式的 loader，并且参数取决于第一个 loader 名称
      [hash]：模块标识符的 hash
      [id]：模块标识符
      [loaders]：显式的 loader，并且参数取决于第一个 loader 名称
      [resource]：用于解析文件的路径和用于第一个 loader 的任意查询参数
      [resource-path]：不带任何查询参数，用于解析文件的路径
    */
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map', // 用于追踪到错误和警告在源代码中的原始位置（注：不要用于生产环境）
  devServer: { // 自动刷新浏览器（使用 webpack-dev-server 插件）
    contentBase: './dist',
    hot: true, // 支持热更新(只更新改动的文件部分，而不是所有的文件重新构建)
    port: 8082, // 端口
  },
  resolve: { // 模块路径配置(解析选项)
    extensions: ['.js', '.vue', '.json'], // 忽略某些文件类型拓展名
    alias: { // 指定某些的路径的简写
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components'),
      'views': path.resolve(__dirname, '../src/views'),
      'api': path.resolve(__dirname, '../src/api'),
      'utils': path.resolve(__dirname, '../src/utils'),
      'store': path.resolve(__dirname, '../src/store'),
      'router': path.resolve(__dirname, '../src/router'),
      'static': path.resolve(__dirname, '../static')
    }
  },
  plugins: [ // 添加插件
    new CleanWebpackPlugin(['dist']), // 打包前清除之前的文件
    new HtmlWebpackPlugin({ // 用新生成的 index.html 文件替换原来的 index.html
      title: 'Output Management',
      // filename: config.build.index,
      // template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
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
    new webpack.HotModuleReplacementPlugin(), // 模块热替换
    // new webpack.optimize.UglifyJsPlugin({
    //   // sourceMap 方便 debug 和运行基准测试，webpack 可以在 bundle 中生成内联的 source map 或生成到独立文件。
    //   // sourceMap: options.devtool && (options.devtool.indexOf("sourcemap") >= 0 || options.devtool.indexOf("source-map") >= 0),
    //   sourceMap: true,
    // }),
    new webpack.DefinePlugin({ // 创建一个在编译时可以配置的全局常量
      /*
        如果这个值是一个字符串，它会被当作一个代码片段来使用。
        如果这个值不是字符串，它会被转化为字符串(包括函数)。
        如果这个值是一个对象，它所有的 key 会被同样的方式定义。
        如果在一个 key 前面加了 typeof,它会被定义为 typeof 调用。
      */
      PRODUCTION: JSON.stringify(true), // true
      VERSION: JSON.stringify("5fa3b9"), // "5fa3b9"
      BROWSER_SUPPORTS_HTML5: true, // true
      TWO: "1+1", // 2
      "typeof window": JSON.stringify("object"),
      BASE_API_TEST: '"http://10.1.5.127:8092"',
      // SELF_ENV: { NODE_ENV: '"development"', BASE_API: 'http://10.1.5.127:8092' },
    }),
  ],
  module: {
    /*
      三种使用 loader 的方式：
        1. 配置（推荐）：在 webpack.config.js 文件中指定 loader。如：下面的配置（尽可能使用 module.rules 配置，因为这样可以减少源码中的代码量，并且可以在出错时，更快地调试和定位 loader 中的问题。）
        2. 内联：在每个 import 语句中显式指定 loader。如：import Styles from 'style-loader!css-loader?modules!./styles.css';
        3. CLI：在 shell 命令中指定它们。如：webpack --module-bind jade-loader --module-bind 'css=style-loader!css-loader'，这会对 .jade 文件使用 jade-loader，对 .css 文件使用 style-loader 和 css-loader
        注：使用 ! 将资源中的 loader 分开；选项可以传递查询参数，例如 ?key=value&foo=bar，或者一个 JSON 对象，例如 ?{"key":"value","foo":"bar"}
    */
    rules: [ // rules 也可以写成 loaders（对模块的源代码进行转换，类似于 gulp 的 task）
      {
        test: /\.css$/, // 需要转换的文件类型
        use: ['style-loader', 'css-loader'], // loader 也可以写成 use（需要使用的转换工具(依赖)）
      },
      /* file-loader：文件保留，使用文件名
         url-loader： 文件转换成代码，如图片转换成 base64 格式 */
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['url-loader']
      },
      // {
      //   test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      //   loader: 'url-loader',
      //   options: {
      //     limit: 10000,
      //     name: utils.assetsPath('img/[name].[hash:7].[ext]')
      //   }
      // },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['url-loader']
      },
      {
        test: /\.xml$/,
        use: ['xml-loader']
      },
    ]
  }
};