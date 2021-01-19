const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar') // 监听文件变化
const webpack = require('webpack')
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')

const resolve = file => path.resolve(__dirname, file)

module.exports = (server, callback) => {
    let ready
    const onReady = new Promise(r => ready = r)

    // 监视构建 --> 更新 Renderer

    let template
    let serverBundle
    let clientManifest

    // 更新函数
    const update = () => {
        if (template && serverBundle && clientManifest) {
            ready()
            callback(serverBundle, template, clientManifest)
        }
    }

    update() // 初始调用
    // 监视构建 template --> 调用 update --> 更新 Renderer 渲染器
    const templatePath = resolve('../index.template.html')
    template = fs.readFileSync(templatePath, 'utf-8')
    // fs.watch、fs.watchFile
    // chokidar 第三方包，监听文件的变化
    chokidar.watch(templatePath).on('change', () => {
        template = fs.readFileSync(templatePath, 'utf-8')
        update()
    })

    // 监视构建 serverBundle --> 调用 update --> 更新 Renderer 渲染器
    const serverConfig = require('./webpack.server.config')
    // webpack 构建实例
    const serverCompiler = webpack(serverConfig)
    const serverDevMiddleware = devMiddleware(serverCompiler, {
        logLevel: 'silent' // 关闭日志输出 4.0.0+ 不支持，由 FriendlyErrorsWebpackPlugin 处理
    })
    // 调用钩子，注册插件 
    serverCompiler.hooks.done.tap('server', () => {
        serverBundle = JSON.parse(
            // serverDevMiddleware.fileSystem 操作内存中的文件，类似于 fs(操纵磁盘中的文件)
            serverDevMiddleware.fileSystem.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8')
        )
        update()
    })

    // serverCompiler.watch({
    //     // 监视打包的可选配置参数
    // }, (err, stats) => {
    //     if (err) throw err // webpack 配置信息报错
    //     // stats 结果模块构建出的相关对象
    //     if (stats.hasErrors()) return // 源代码中存在错误
    //     serverBundle = JSON.parse(
    //         fs.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8')
    //     )
    //     update()
    // })

    // 监视构建 clientManifest --> 调用 update --> 更新 Renderer 渲染器
    const clientConfig = require('./webpack.client.config')
    clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
    clientConfig.entry.app = [
        'webpack-hot-middleware/client?quiet=true&reload=true', // 和服务端交互处理热更新一个客户端脚本
        clientConfig.entry.app // 本来的脚本
    ]
    clientConfig.output.filename = '[name].js' // 热更新模式下确保一致的 hash，即不设置hash
    // webpack 构建实例
    const clientCompiler = webpack(clientConfig)
    const clientDevMiddleware = devMiddleware(clientCompiler, {
        // 重要！输出资源的访问路径前缀，应该和 客户端打包输出的 publicPath 一致
        publicPath: clientConfig.output.publicPath, 
        logLevel: 'silent', // 关闭日志输出，由 FriendlyErrorsWebpackPlugin 处理
    })
    // 调用钩子，注册插件 
    clientCompiler.hooks.done.tap('client', () => {
        clientManifest = JSON.parse(
            // clientDevMiddleware.fileSystem 操作内存中的文件，类似于 fs(操纵磁盘中的文件)
            clientDevMiddleware.fileSystem.readFileSync(resolve('../dist/vue-ssr-client-manifest.json'), 'utf-8')
        )
        update()
    })

    server.use(hotMiddleware(clientCompiler, {
        log: false // 关闭它本身的日志输出
    }))

    // 重要！！！将 clientDevMiddleware 挂载到 Express 服务中，提供对其内部内存中数据的访问
    server.use(clientDevMiddleware)

    return onReady
}