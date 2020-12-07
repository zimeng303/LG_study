module.exports = {
  mode: 'none',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js'
  },
  // 集中配置 webpack 内部的优化功能
  optimization: {
    // 模块只导出被使用的成员
    usedExports: true,
    // 尽可能将所有模块合并并输出到到一个函数中
    concatenateModules: true,
    // 压缩输出结果
    minimize: true
  }
}
