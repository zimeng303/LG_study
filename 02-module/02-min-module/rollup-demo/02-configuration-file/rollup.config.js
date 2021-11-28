/**
 * 导出一个配置对象
 */
export default {
  // 指定打包的入口文件
  input: 'src/index.js',
  // 指定输出文件的配置信息
  output: {
    // 指定输出文件的文件名
    file: 'dist/bundle.js',
    // 指定输出文件的格式
    format: 'iife'
  }
}
