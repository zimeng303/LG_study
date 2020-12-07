const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');

// 定义一个类型
class MyPlugin {
  /**
   * 在 webpack 启动时，自动被调用
   * @param {*} compiler 
   * compiler 对象参数，是 webpack 工作过程中最核心的一个对象
   * compiler 对象参数，包含了此次构建的所有配置信息
   * 通过 compiler 对象注册钩子函数
   */
  apply(compiler) {
    console.log('MyPlugin 启动');
    /**
     * 通过 compiler.hooks 可以访问到钩子
     * 通过 tap 方法去注册钩子函数
     * tap方法，接收两个参数：
     * -- 第一个参数：插件的名称
     * -- 第二个参数：需要挂载到钩子上的函数
     */
    compiler.hooks.emit.tap('MyPlugin', compilation => {
      // compilation 对象 => 可以理解为此次打包的上下文
      // 所有打包的结果，都会放到 compilation 对象当中

      for (const name in compilation) {
        // 对象中的键(属性名)，代表每一个资源文件的名称

        // 判断只对 js文件 进行处理
        if (name.endsWith('.js')) {
          // assets 获取即将写入目录当中的资源文件信息
          // source() 拿到对应的资源文件的内容
          const contents = compilation.assets[name].source()
          // 使用正则替换代码中的注释
          const withoutComments = contents.replace(/\/*\**\*\//g, '')
          // 将结果 覆盖到原有的文件中
          compilation.assets[name] = {
            source: () => withoutComments, // 返回新内容
            size: () => withoutComments.length // 返回内容的大小，必须方法
          }
        }
      }
    })
  }
}

module.exports = {
  mode: 'none',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
    // publicPath: 'dist/'
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
    // 用于生成 index.html
    new HtmlWebpackPlugin({
      title: 'Webpack Plugin Sample',
      meta: {
        viewport: 'width=device-width'
      },
      template: './src/index.html'
    }),
    // 用于生成 about.html
    new HtmlWebpackPlugin({
      filename: 'about.html'
    }),
    new CopyWebpackPlugin([
      // 'public/**'
      'public'
    ]),
    // 应用 MyPlugin 插件
    new MyPlugin()
  ]
}
