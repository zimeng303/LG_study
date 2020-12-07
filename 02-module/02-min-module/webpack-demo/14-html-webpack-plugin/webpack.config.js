const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

// html-webpack-plugin 默认导出的就是一个类型，无需解构其内部成员
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'none',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
    // publicPath: 'dist/' // 自动生成 html 时，不需配置
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
  plugins: [
    new CleanWebpackPlugin(),
    // 添加 HtmlWebpackPlugin 实例对象    
    // 自定义输出文件内容：给构造函数传入对象参数，指定配置选项
    new HtmlWebpackPlugin({ // 用于生成 index.html
      title: 'Webpack Plugin Sample', // 设置 HTML 的标题
      meta: { // 设置页面中的 元数据标签
        viewport: 'width=device-width'
      },
      // 指定模板文件，使生成的HTML文件根据模板文件进行生成
      template: './src/index.html'
    }),
    // 同时输出多个页面文件, 即可以添加多个 HtmlWebpackPlugin 实例
    // 每一个 HtmlWebpackPlugin 实例，就是用来生成一个 HTML文件的
    new HtmlWebpackPlugin({ // 用于生成 about.html
      filename: 'about.html' // 指定输出的文件名
    })
  ]
}
