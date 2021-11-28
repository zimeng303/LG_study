// 默认导出插件函数
import json from 'rollup-plugin-json'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  // plugins 属性，存放插件函数的调用结果
  plugins: [
    // 插件函数的调用结果
    json()
  ]
}
