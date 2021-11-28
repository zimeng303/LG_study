const webpack = require('webpack')

module.exports = {
  mode: 'none',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    // DefinePlugin是 webpack 的内置插件
    // 构造函数接收一个对象，对象中的每一个键值都会被注入到代码中
    new webpack.DefinePlugin({
      // 值要求的是一个 JS代码片段
      API_BASE_URL: JSON.stringify('https://api.example.com')
    })
  ]
}
