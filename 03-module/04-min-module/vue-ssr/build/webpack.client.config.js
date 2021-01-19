/**
* 客户端打包配置 
*/
// 用来 webpack 配置信息
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.config.js')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

module.exports = merge(baseConfig, {
    entry: { // 客户端打包的入口
        // 相对路径，相对于执行打包所处的目录 vue-ssr 目录
        app: './src/entry-client.js'
    },
    module: {
        rules: [
            // ES6 转 ES5    
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/, use: {
                    loader: 'babel-loader', options: {
                        presets: ['@babel/preset-env'], 
                        cacheDirectory: true, 
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            },
        ]
    },
    // 重要信息：这将 webpack 运行时分离到一个引导 chunk 中， 
    // 以便可以在之后正确注入异步 chunk。
    optimization: {
        splitChunks: {
            name: "manifest", 
            minChunks: Infinity
        }
    },
    plugins: [
        // 此插件在输出目录中生成 `vue-ssr-client-manifest.json`。 
        // 该文件描述了 客户端打包后结果中的一些依赖，包括加载的一些文件信息
        new VueSSRClientPlugin()
    ]
})