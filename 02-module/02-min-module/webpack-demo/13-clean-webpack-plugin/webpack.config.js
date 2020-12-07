const path = require('path')
// 导入 clean-webpack-plugin 插件，这个插件导出一个 CleanWebpackPlugin 成员

const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'none',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
    publicPath: 'dist/'
  },
  module: {
    rules: [
      {
        test: /.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /.png$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10 * 1024 // 10 KB
          }
        }
      }
    ]
  },
  // 专门用来配置插件的属性
  plugins: [
    // 一般插件导出的都是一个类型，通过这个类型创建实例
    // 然后将这个实例，放入到 plugins 数组中
    new CleanWebpackPlugin()
  ]
}
