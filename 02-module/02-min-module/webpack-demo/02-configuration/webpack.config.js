const path = require('path')

module.exports = {
    // 指定 webpack 打包的入口文件
    // 相对路径时，./ 不能省略
    entry: './src/main.js',
    // 设置输出文件的位置
    output: {
        filename: 'bundle.js', // 设置输出文件的名称
        // 指定输出文件所在的目录，必须是绝对路径
        // 利用 node 的 path 模块，组合生成绝对路径
        path: path.join(__dirname, 'output')     
    }
}