module.exports = {
  mode: 'none',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  optimization: {
    // 手动开启特性
    sideEffects: true,
    // 模块只导出被使用的成员
    // usedExports: true,
    // 尽可能合并每一个模块到一个函数中
    // concatenateModules: true,
    // 压缩输出结果
    // minimize: true,
  }
}
