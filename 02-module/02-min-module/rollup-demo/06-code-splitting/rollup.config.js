export default {
  input: 'src/index.js',
  output: {
    // file: 'dist/bundle.js', // 只能指定一个文件
    // format: 'iife'
    dir: 'dist',  // 需要输出多个文件
    format: 'amd' // 浏览器环境中，遵循 AMD 标准
  }
}
