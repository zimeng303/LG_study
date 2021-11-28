const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 导入 mini-css-extract-plugin 插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 导入 optimize-css-assets-webpack-plugin
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
// 导入 webpack 内置的 JS 压缩插件
const TerserWebpackPlugin = require('terser-webpack-plugin')


module.exports = {
  mode: 'none',
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: '[name].bundle.js'
  },
  optimization: {
    // 只有在 minimizer 特性开启时，才会运行其内部的插件
    // 生产模式时，minimizer 特性自动开启，即下面插件才会工作
    // 配置 minimizer 时，webpack 内部的压缩插件就会失效，需要手动添加
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
          'style-loader', // 将样式通过 style 标签注入到页面中
          // 实现样式文件通过 link 标签的方式注入
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  // plugins 中的插件在任何时候都会运行
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Dynamic import',
      template: './src/index.html',
      filename: 'index.html'
    }),
    // 创建 MiniCssExtractPlugin 插件实例，自动提取 CSS 到单个文件中
    new MiniCssExtractPlugin()
  ]
}
