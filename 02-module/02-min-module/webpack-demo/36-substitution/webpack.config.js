const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = {
  mode: 'none',
  entry: {
    main: './src/index.js'
  },
  output: {
    // [hash] 属于项目级别的，即项目中的任何一个地方变化，会导致打包时，所有的hash值全部改变
    // filename: '[name]-[hash].bundle.js'

    // [chunkhash] 属于 chunk 级别的，即在打包中，只要是同一路的打包，chunkhash 就是相同的
    // 相比于 [hash]，控制较精确一点
    // filename: '[name]-[chunkhash].bundle.js'

    // [contenthash] 属于文件级别的，根据输出文件的内容输出 hash值，即不同的文件就有不同的hash值
    // 最适合解决缓存问题，可以指定hash的长度:number
    filename: '[name]-[contenthash:8].bundle.js'
  },
  optimization: {
    minimizer: [
      new TerserWebpackPlugin(),
      new OptimizeCssAssetsWebpackPlugin()
    ]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 'style-loader', // 将样式通过 style 标签注入
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Dynamic import',
      template: './src/index.html',
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin({
      // filename: '[name]-[hash].bundle.css'
      // filename: '[name]-[chunkhash].bundle.css'

      filename: '[name]-[contenthash].bundle.css'
    })
  ]
}
