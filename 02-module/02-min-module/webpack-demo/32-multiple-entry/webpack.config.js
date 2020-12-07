const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'none',
  /**
   * entry 属性值的形式：
   *       字符串：设置一个打包入口
   *       数 组： 将多个文件打包进一个文件中
   *       对 象： 设置多个打包入口，分别生成对应的打包文件
   *              一个属性对应一个打包入口，
   *              属性名为入口名称，属性值为入口所对应的文件路径
   */ 
  entry: { 
    index: './src/index.js',
    album: './src/album.js'
  },
  output: {
    // 多个入口，就意味着生成多个打包文件
    // 使用 [name] 占位符，动态输出文件名
    // [name] 最终会被替换成 入口的名称
    filename: '[name].bundle.js'
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
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Multi Entry',
      template: './src/index.html',
      filename: 'index.html',
      // 指定每个 HTML 文件所使用的 bundle文件
      // 每个打包入口会形成独立的 chunks
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      title: 'Multi Entry',
      template: './src/album.html',
      filename: 'album.html',
      chunks: ['album']
    })
  ]
}
