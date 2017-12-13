function FileListPlugin(options) {}

FileListPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', function(compilation, callback) {

    // console.log(compilation.modules[0]);

    // 创建一个头部字符串：
    var filelist = '\nIn this build:\n\n';

    // 检查所有编译好的资源文件：
    // 为每个文件名新增一行
    for (var filename in compilation.assets) {
      filelist += ('- '+ filename +'\n');
    }

    // 把它作为一个新的文件资源插入到 webpack 构建中：
    compilation.assets['filelist.md'] = {
      source: function() {
        return filelist;
      },
      size: function() {
        return filelist.length;
      }
    };

    console.log(filelist);

    // 探索每个块（构建后的输出）:
    compilation.chunks.forEach(function(chunk) {
      // 探索块中的每个模块（构建时的输入）：
      console.log('-', chunk.name);
      console.log('-', chunk.files);
      chunk.modules.forEach(function(module) {
        // 探索模块中包含的的每个源文件路径：
        console.log('   =', module.id);
        module.fileDependencies.forEach(function(filepath) {
          // 现在我们已经知道了很多的源文件结构了……
          console.log('     --', filepath);
        });
      });

      // 探索块生成的每个资源文件名
      chunk.files.forEach(function(filename) {
        // 得到块生成的每个文件资源的源码
        var source = compilation.assets[filename].source();
      });
    });
    /*
      compilation.modules: 一个存放编译中涉及的模块（构建时的输入）的数组。每个模块处理了你源码库中的一个原始文件的构建。
      module.fileDependencies: 一个存放模块中包含的源文件路径的数组。它包含了 JavaScript 源文件自身（例如：index.js），和所有被请求（required）的依赖资源文件（样式表，图像等等）。想要知道哪些源文件属于这个模块时，检查这些依赖是有帮助的。
      compilation.chunks: 一个存放编译中涉及的块（构建后的输出）的数组。每个块处理了一个最终输出资源的组合。
      chunk.modules: 一个存放块中包含的模块的数组。为了扩展，你也许需要查阅每个模块的依赖来得知哪些源文件注入到了块中。
      chunk.files: 一个存放了块生成的输出文件的文件名的数组。你也许需要从 compilation.assets 中访问这些资源内容。
    */

    // 监控跟踪图（跟踪的文件路径和相应的时间戳）
    // console.log(compilation.fileTimestamps);

    // var changedFiles = Object.keys(compilation.fileTimestamps).filter(function(watchfile) {
    //   return (this.prevTimestamps[watchfile] || this.startTime) < (compilation.fileTimestamps[watchfile] || Infinity);
    // }.bind(this));

    // this.prevTimestamps = compilation.fileTimestamps;


    // 监控跟踪图（跟踪哈希）
    // console.log(this.chunkVersions);

    // !this.chunkVersions && (this.chunkVersions = {});
    // var changedChunks = compilation.chunks.filter(function(chunk) {
    //   var oldVersion = this.chunkVersions[chunk.name];
    //   this.chunkVersions[chunk.name] = chunk.hash;
    //   return chunk.hash !== oldVersion;
    // }.bind(this));

    callback();
  }.bind(this));
};

module.exports = FileListPlugin;