/**
* 公共配置 
*/
// 处理 .vue 资源的插件
const VueLoaderPlugin = require('vue-loader/lib/plugin')
// 处理路径
const path = require('path')
// 提供 webpack 打包过程中，友好的日志输出
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

// 将路径进行组合，从而得到绝对安全的路径
const resolve = file => path.resolve(__dirname, file)

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
    // 打包模式
    mode: isProd ? 'production' : 'development',
    // 打包结果输出
    output: {
        path: resolve('../dist/'),
        publicPath: '/dist/', // 打包结果的请求路径
        filename: '[name].[chunkhash].js'
    },
    resolve: {
        alias: {
            // 路径别名，@ 指向 src      
            '@': resolve('../src/')
        },
        // 可以省略的扩展名
        // 当省略扩展名的时候，按照从前往后的顺序依次解析   
        extensions: ['.js', '.vue', '.json']
    },
    // 定位到原始代码的位置，方便调试
    devtool: isProd ? 'source-map' : 'cheap-module-eval-source-map',
    module: {
        rules: [
            // 处理图片资源     
            {
                test: /\.(png|jpg|gif)$/i, use: [
                    {
                        loader: 'url-loader', options: {
                            limit: 8192,
                        },
                    }
                ]
            },
            // 处理字体资源    
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/, use: [
                    'file-loader',
                ],
            },
            // 处理 .vue 资源     
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            // 处理 CSS 资源
            // 它会应用到普通的 `.css` 文件
            // 以及 `.vue` 文件中的 `<style>` 块     
            {
                test: /\.css$/, use: [
                    'vue-style-loader', 'css-loader'
                ]
            },

            // CSS 预处理器，参考：https://vue-loader.vuejs.org/zh/guide/pre- processors.html
            // 例如处理    Less 资源
            // {
            //   test: /\.less$/,
            //   use: [
            //     'vue-style-loader',
            //     'css-loader',
            //     'less-loader'
            //   ]
            // }, 
        ]
    },
    plugins: [
        // 打包 .vue 文件所必须的插件
        new VueLoaderPlugin(),
        // 提供友好的错误日志输出
        new FriendlyErrorsWebpackPlugin()
    ]
}