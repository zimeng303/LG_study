const path = require('path')

module.exports = {
    mode: 'development', // 配置打包的工作模式
    entry: './src/main.js',
    output: {
        filename: 'main.js',
        path: path.join(__dirname, 'dist'),
        publicPath: 'dist/'  // 设置网站的根目录 / 不能省略
    },
    module: {
        // 针对其他资源模块的加载规则的配置
        rules: [
            {
                test: /.js$/,
                use: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            },
            {   
                // 正则表达式，用来匹配在打包过程中遇到的文件路径
                test: /.css$/,
                // 用来指定匹配到的文件，需要去使用的 loader
                use: [ // 若配置多个loader，执行顺序是 从后往前 的
                    'style-loader', 
                    'css-loader' // 先执行
                ]
            },
            {
                test: /.png$/,
                use: {
                    loader: 'url-loader',
                    options: { // 设置配置选项
                        limit: 10 * 1024 // 10 KB 单位字节，只匹配 10 KB 以下的
                    }
                }                
            }
        ]
    }
}