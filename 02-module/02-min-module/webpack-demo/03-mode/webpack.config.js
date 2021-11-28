const path = require('path')

module.exports = {
    mode: 'development', // 配置打包的工作模式
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'output')
    }
}