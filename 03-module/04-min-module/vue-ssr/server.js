/**
* 服务端入口，仅运行于服务端 
*/
const Vue = require('vue')
const express = require('express')
const fs = require('fs')
const { createBundleRenderer } = require('vue-server-renderer')
const setupDevServer = require('./build/setup-dev-server')

// 创建一个 experss 的 server 实例
const server = express()

// 开头的路径，需要与 output 中设置的 publicPath 保持一致
// express.static 处理的是物理磁盘中的资源文件
server.use('/dist', express.static('./dist'))

const isProd = process.env.NODE_ENV === 'production'

let renderer
let onReady
if (isProd) {
    // 生产模式，直接基于已构建好的包创建渲染器
    const serverBundle = require('./dist/vue-ssr-server-bundle.json')
    const template = fs.readFileSync('./index.template.html', 'utf-8')
    const clientManifest = require('./dist/vue-ssr-client-manifest.json')
    // 创建一个渲染器
    renderer = createBundleRenderer(serverBundle, {
        runInNewContext: false, // 推荐
        template, // (可选) 设置页面模板
        clientManifest // (可选) 客户端构建
    })
} else {
    // 开发模式 --> 监视打包构建（客户端 + 服务端） --> 重新生成 Renderer 渲染器
    onReady = setupDevServer(server, (serverBundle, template, clientManifest) => {
        renderer = createBundleRenderer(serverBundle, {
            runInNewContext: false, // 推荐
            template, // (可选) 设置页面模板
            clientManifest // (可选) 客户端构建
        })
    })
}


/**
 * @param {Vue} 
 * @param {Object} 
 * @param {Function} 
 */
// 这里无需传入一个应用程序，因为在执行    bundle 时已经自动创建过。  
// 现在我们的服务器与应用程序已经解耦！
// bundle renderer 在调用    renderToString 时，
// 它将自动执行「由    bundle 创建的应用程序实例」所导出的函数（传入上下文作为参数），然后渲染 它。
const render = (req, res) => {
    renderer.renderToString({
        // 配置传到模板中的数据
        title: '拉勾教育',
        meta: `<meta name="description" content="拉勾教育">`
    }, (err, html) => {
        if (err) {
            return res.status(500).end('Internal Server Error')
        }
        // html 就是渲染出来的结果字符串
        // 添加响应头，解决编码问题
        res.setHeader('Content-Type', 'text/html; charset=utf8')
        // 结合了模板的完整内容
        res.end(html)
    })
}

// 添加路由
server.get('/', isProd
    ? render // 生产模式：使用构建好的包直接渲染
    : async (req, res) => {
        // 等待有了 Renderer 渲染器以后，调用 render 函数
        await onReady
        render(req, res)
    })

server.listen(3000, () => {
    console.log('server running at port 3000');
})