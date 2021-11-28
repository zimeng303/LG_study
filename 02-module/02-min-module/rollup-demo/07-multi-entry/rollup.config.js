export default {
  // input: ['src/index.js', 'src/album.js'],
  input: { 
    foo: 'src/index.js',
    bar: 'src/album.js'
  },
  // 多入口打包，会提取公共模块，会实行代码拆分
  output: {
    dir: 'dist',
    format: 'amd'
  }
}
