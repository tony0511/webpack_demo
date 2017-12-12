const path = require('path'); // 路径管理插件
// const CleanWebpackPlugin = require('clean-webpack-plugin'); // 打包前清除之前的文件
const webpack = require('webpack');
const config = require('../config');
const utils = require('./utils');
const htmlPagesConfig = require('../config/htmlpage.config');

function resolve (dir) { // 缩写目录
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre', // 指定 loader 种类（所有 loader 通过 后置-post, 行内, 普通, 前置-pre 排序，并按此顺序使用，默认为 普通）
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = { // webpack 基本配置导出
  // target: 'web', // 构建目标，可选值 node、node-webkit、web、webworker、async-node、electron-main、electron-renderer，默认为 web
  // recordsPath: path.join(__dirname, '../dist/records.json'), // 生成包含 webpack 记录的 JSON 文件（主要用来比较各个编译之间模块的改变）
  context: path.resolve(__dirname, "../"), // 基础目录，绝对路径，用于从配置中解析入口起点(entry point)和 loader（默认使用当前目录，但是推荐在配置中传递一个值。这使得你的配置独立于 CWD(current working directory - 当前执行路径)）
  /*
    entry: './path/to/my/entry/file.js', 等价于 entry: { main: './path/to/my/entry/file.js' },
  */
  // entry: './src/index.js', // 单个入口
  // entry: { // 入口起点
  //   app: './src/main.js', // 入口1
  //   // print: './src/print.js' // 入口2 用于多页开发
  // },
  entry: utils.getEntry(htmlPagesConfig.htmlPages), // 入口
  output: { // 输出
    path: config.build.assetsRoot, // 目标输出目录 path 的绝对路径
    filename: '[name].js', // 输出文件的文件名
    publicPath: process.env.NODE_ENV === 'production' // 该选项的值是以 runtime(运行时) 或 loader(载入时) 所创建的每个 URL 为前缀
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath,
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
  },
  resolve: { // 解析
    extensions: ['.js', '.vue', '.json', '.ts'], // 忽略某些文件类型拓展名
    alias: { // 指定某些的路径的简写
      'vue$': 'vue/dist/vue.esm.js', // 精确路径
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
    },
    // // webpack 解析模块时应该搜索的目录（默认为['node_modules']）
    // modules: [path.resolve(__dirname, "src"), "node_modules"],
  },
  performance: { // 性能提示
    // hints: 'warning', // 性能提示级别，可选值 false、error 和 warning，默认为 false
    maxEntrypointSize: 100000, // 入口起点文件大小限制（默认为 250000 bytes）
    maxAssetSize: 100000, // 从 webpack 生成的任何文件大小限制（默认为 250000 bytes）
    assetFilter: function(assetFilename) { // 过滤出哪些文件需要提示
      return !(/\.map$/.test(assetFilename));
    },
  },
  plugins: [ // 添加插件（注：相同的插件不要重复引入，否则会报错）
    ...utils.getPagesPlugins(htmlPagesConfig.htmlPages), // 各个页面插件加入
    new webpack.ProvidePlugin({ // 通过 npm等 安装的插件（添加全局变量）
      jQuery: "jquery",
      $: "jquery",
      moment: "moment",
    }),
    // new webpack.DefinePlugin({ // 创建一个在编译时可以配置的全局常量
      /*
        如果这个值是一个字符串，它会被当作一个代码片段来使用。
        如果这个值不是字符串，它会被转化为字符串(包括函数)。
        如果这个值是一个对象，它所有的 key 会被同样的方式定义。
        如果在一个 key 前面加了 typeof,它会被定义为 typeof 调用。
      */
      // PRODUCTION: JSON.stringify(true), // true
      // VERSION: JSON.stringify("5fa3b9"), // "5fa3b9"
      // BROWSER_SUPPORTS_HTML5: true, // true
      // TWO: "1+1", // 2
      // "typeof window": JSON.stringify("object"),
      // SELF_ENV: { NODE_ENV: '"development"', BASE_API: 'http://10.1.5.127:8092' },
    // }),
  ],
  module: {
    /*
      三种使用 loader 的方式：
        1. 配置（推荐）：在 webpack.config.js 文件中指定 loader。如：下面的配置（尽可能使用 module.rules 配置，因为这样可以减少源码中的代码量，并且可以在出错时，更快地调试和定位 loader 中的问题。）
        2. 内联：在每个 import 语句中显式指定 loader。如：import Styles from 'style-loader!css-loader?modules!./styles.css';
        3. CLI：在 shell 命令中指定它们。如：webpack --module-bind jade-loader --module-bind 'css=style-loader!css-loader'，这会对 .jade 文件使用 jade-loader，对 .css 文件使用 style-loader 和 css-loader
        注：使用 ! 将资源中的 loader 分开；选项可以传递查询参数，例如 ?key=value&foo=bar，或者一个 JSON 对象，例如 ?{"key":"value","foo":"bar"}
        loader 通常被用 ! 连写。这一写法在 webpack 2 中只在使用旧的选项 module.loaders 时才有效。
    */
    rules: [ // rules 也可以写成 loaders，但是 rules 是新的参数（对模块的源代码进行转换，类似于 gulp 的 task）
      ...(config.dev.useEslint ? [createLintingRule()] : []), // 添加 eslint 检查
      {
        test: /\.html$/, // html 文件处理
        use: [{
          // raw-loader 不会处理 src，只是将 html 文件转换成字符串，但是 html-loader 不仅可以将 html 文件转换成字符串，而且还可以处理 src
          loader: 'html-loader',
          options: { // 或可以使用 query 名称
            // minimize: false,
            attrs: ['img:src', 'audio:src', 'video:src', 'source:src'], // 拓展一些需要处理的 src，默认只有 'img:src'
          },
        }],
      },
      {
        test: /\.js$/, // js 文件处理
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')],
      },
      {
        test: /\.tsx?$/, // typeScript 文件处理
        loader: 'ts-loader',
        include: [resolve('src'), resolve('test')], // 会处理的目录
        options: { transpileOnly: false },
      },
      /* file-loader：文件保留，使用文件名
         url-loader： 文件转换成代码，如图片转换成 base64 格式 */
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/, // 图片处理
        loader: 'url-loader',
        options: {
          limit: 10000, // 上限不能超过 10000 Bytes，超过后不嵌入到 html 文件中，以文件方式处理（文件名为下面的 name 属性）
          name: utils.assetsPath('img/[name].[hash:10].[ext]'),
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, // 音视频处理
        loader: 'url-loader',
        options: {
          limit: 10000, // 上限不能超过 10000 Bytes，超过后不嵌入到 html 文件中，以文件方式处理（文件名为下面的 name 属性）
          name: utils.assetsPath('media/[name].[hash:10].[ext]'),
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/, // 字体处理
        loader: 'url-loader',
        options: {
          limit: 10000, // 上限不能超过 10000 Bytes，超过后不嵌入到 html 文件中，以文件方式处理（文件名为下面的 name 属性）
          name: utils.assetsPath('fonts/[name].[hash:10].[ext]'),
        }
      },
      {
        test: /\.xml$/, // xml 文件处理
        use: ['xml-loader'],
      },
    ]
  }
};