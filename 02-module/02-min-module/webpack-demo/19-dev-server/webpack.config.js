const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'none',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  },
  // 专门为 webpack-dev-server 指定的配置选项, 开发阶段的配置
  devServer: {
    // 额外为开发服务器指定查找静态资源目录，可以是字符串或数组，配置一个或多个
    contentBase: ['./public'],
    // proxy属性，用来添加代理服务配置
    proxy: {
      /**
       * 每一个属性就是一个代理规则的配置
       * 属性名: 需要被代理的请求路径前缀，
       *        即请求以哪一个地址开始，就会走对应的代理请求
       * 属性值: 为这个前缀所匹配到的代理规则配置 
       */ 
      '/api': {
        // http://localhost:8080/api/users => https://api.github.com/api/users
        target: 'https://api.github.com', // 代理目标
        // http://localhost:8080/api/users => https://api.github.com/users
        // 如果代理目标地址中没有‘/api’,则需要重写代理目标地址
        pathRewrite: {
          '^/api': '' // 以正则的形式进行匹配，以 ^ 开头
        },
        // 不能使用 localhost:8080 作为请求 GitHub 的主机名
        // 设置改变主机名
        changeOrigin: true
      }
    }
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
      title: 'Webpack Tutorials',
      meta: {
        viewport: 'width=device-width'
      },
      template: './src/index.html'
    }),
    // 开发阶段最好不要使用这个插件
    // 一般放在上线前的最后一次打包使用
    // 开发阶段需要频繁的serve, 多次使用插件会影响运行效率
    // new CopyWebpackPlugin(['public'])
  ]
}
