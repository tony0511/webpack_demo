const path = require('path');
const config = require('../config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 用新生成的 index.html 文件替换原来的 index.html

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory;

  return path.posix.join(assetsSubDirectory, _path);
}

exports.cssLoaders = function (options) {
  options = options || {};

  const cssLoader = { // 将 CSS 转化成 CommonJS 模块
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap,
    }
  }

  const postcssLoader = { // 处理 postcss
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap,
    }
  }
  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) { // 将 less、scss、stylus 等编译成 CSS
    // var loaders = [cssLoader]
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader];

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({ // 提取 css 部分
        use: loaders,
        // fallback: 'vue-style-loader', // 针对 vue 使用的 loader
        fallback: 'style-loader', // 将 JS 字符串生成为 style 节点
      });
    } else {
      // return ['vue-style-loader'].concat(loaders); // 针对 vue 使用的 loader
      return ['style-loader'].concat(loaders); // 将 JS 字符串生成为 style 节点
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
/*
  sass-loader、less-loader：将 Sass 或 less 编译成 CSS
  css-loader：将 CSS 转化成 CommonJS 模块
  style-loader： 将 JS 字符串生成为 style 节点
*/
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)
  for (let extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output;
}

exports.getEntry = function (htmlPages){ // js 入口导出
  if(!htmlPages) {
    return {};
  }
  const entry = {};
  for(let i = 0, pagesLen = htmlPages.length; i < pagesLen; i++) {
    const pageName = htmlPages[i].template.split('.')[0];
    const chunk = htmlPages[i].chunks;
    for(let j = 0, jsLen = chunk.length; j < jsLen; j++) {
      entry[chunk[j]] = path.join(config.build.pagesRoot, pageName, chunk[j] + '.js');
    }
  }
  // console.log(entry);

  return entry;
}

exports.getPagesPlugins = function (htmlPages){ // 多页插件导出
  if(!htmlPages) {
    return [];
  }
  let pagesPlugins = [];
  for(let i = 0, len = htmlPages.length; i < len; i++) {
    const pageName = htmlPages[i].template.split('.')[0];
    pagesPlugins.push(new HtmlWebpackPlugin({
      template: path.join(config.build.pagesRoot, pageName, htmlPages[i].template), // 页面模板
      filename: htmlPages[i].template.substr(htmlPages[i].template.lastIndexOf('/')+1), // 页面路径
      chunks: htmlPages[i].chunks.concat(process.env.NODE_ENV === 'production' ? ['vendor', 'manifest'] : []), // 页面用到的 js 的 chunk
      minify: {
        removeComments: true, // 去掉注释
        collapseWhitespace: true, // 去除空格
        removeAttributeQuotes: true, // 去掉引用
        // collapseBooleanAttributes: true, // 合并 boolean 属性
        // removeEmptyAttributes: true, // 去除空属性
        // removeScriptTypeAttributes: true, // 去除 script 标签类型
        // removeStyleLinkTypeAttributes: true, // 去除 style 标签类型
        minifyJS: true, // 压缩 JS
        minifyCSS: true, // 压缩 CSS
      },
      //暂时不要这种hash算法
      //hash: true
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
    }));
  }
  
  return pagesPlugins;
}

exports.createNotifierCallback = () => { // 返回 node 报错信息提示
  const notifier = require('node-notifier');

  return (severity, errors) => {
    if (severity !== 'error') return;

    const error = errors[0];
    const filename = error.file && error.file.split('!').pop();
    const packageConfig = require('../package.json');

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'editDisabled.png'),
    })
  }
}
