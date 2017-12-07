// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: { // 生产环境配置
    // env: require('./prod.env'), // 环境配置
    index: path.resolve(__dirname, '../dist/index.html'), // 输出index页面位置
    assetsRoot: path.resolve(__dirname, '../dist'), // 所有有文件存放的根目录
    assetsSubDirectory: 'static', // 除了 html 文件其他文件的资源静态文件根目录
    assetsPublicPath: '/dist/', // 静态资源文件公共目录（如图片、音视频等），影响 index.html 页面文件引入的 src。
    productionSourceMap: false,
    devtool: '#source-map',
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false, // 是否需要压缩文件
    productionGzipExtensions: ['js', 'css'], // 那些文件需要压缩
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: false, // 是否需要分析报告
    // bundleAnalyzerReport: process.env.npm_config_report,
  },
  dev: { // 开发环境配置
    // env: require('./dev.env'),
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8082, // 开发环境端口配置
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    devtool: '#cheap-module-eval-source-map',
    proxyTable: {
      '/api_service/': {
        target: 'http://10.0.4.72:8092',
        pathRewrite: {
          '^/api_service/': '/'
        },
        changeOrigin: true
      },
      // '/call_api/': {
      //   target: 'http://10.0.4.82:9083',
      //   pathRewrite: {
      //     '^/call_api/': '/callcenter/'
      //   },
      //   changeOrigin: true
      // },
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
