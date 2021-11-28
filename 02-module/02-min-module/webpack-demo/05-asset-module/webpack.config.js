const path = require('path')

module.exports = {
    mode: 'development', // 配置打包的工作模式
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'output')
    },
    module: {
        // 针对其他资源模块的加载规则的配置
        rules: [
            {   
                // 正则表达式，用来匹配在打包过程中遇到的文件路径
                test: /\.css$/,
                // 用来指定匹配到的文件，需要去使用的 loader
                use: [ // 若配置多个loader，执行顺序是 从后往前 的
                    'style-loader', 
                    'css-loader' // 先执行
                ]
            }
        ]
    }
}