#!/usr/bin/env node
const path = require('path')
const { Readable } = require('stream')
// 使用 Koa 开发静态服务器，Koa 是一个新的 web 框架
const Koa = require('koa')
const send = require('koa-send')
const compilerSFC = require('@vue/compiler-sfc')

const app = new Koa()

// 将 流 转换成 字符串
const streamToString = stream => new Promise((resolve, reject) => {
    const chunks = []
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
    stream.on('error', reject)
})

const stringToStream = text => {
    const stream = new Readable()
    stream.push(text)
    stream.push(null)
    return stream
}

// 3. 加载第三方模块
app.use(async (ctx, next) => {
    // ctx.path --> /@modules/vue
    if (ctx.path.startsWith('/@modules/')) {
        const moduleName = ctx.path.substr(10)
        const pkgPath = path.join(process.cwd(), 'node_modules', moduleName, 'package.json')
        const pkg = require(pkgPath)
        ctx.path = path.join('/node_modules', moduleName, pkg.module)
    }
    await next()
})

// 1. 开启静态文件服务器
app.use(async (ctx, next) => {
    /**
     * @param {} ctx 当前执行的上下文
     * @param { String } path 当前请求的路径
     * @param { Object } options 配置选项
     */
    await send(ctx, ctx.path, {
        root: process.cwd(), // 配置项目运行的根目录，即当前运行node程序的目录
        index: 'index.html' // 设置默认的页面
    })
    await next()
})

// 4. 处理单文件组件 @vue/compiler-sfc
app.use(async (ctx, next) => {
    if (ctx.path.endsWith('.vue')) {
        const contents = await streamToString(ctx.body)
        const { descriptor } = compilerSFC.parse(contents)
        let code 
        // 第一次请求单文件组件
        if (!ctx.query.type) {
            code = descriptor.script.content
            // console.log(code);
            code = code.replace(/export\s+default\s+/g, 'const __script = ')
            code += `
                    import { render as __render } from "${ctx.path}?type=template"
                    __script.render = __render
                    export default __script
                    `
        } else if (ctx.query.type === 'template') {
            // 对单文件组件的第二次请求
            const templateRender = compilerSFC.compileTemplate({ source: descriptor.template.content })
            code = templateRender.code
        }
        ctx.type = 'application/javascript'
        ctx.body = stringToStream(code)
    }
    await next()
})

// 2. 修改第三方模块的路径
app.use(async (ctx, next) => {
    if (ctx.type === 'application/javascript') {
        const contents = await streamToString(ctx.body)
        // import vue from 'vue'
        // import App from './App.vue'
        ctx.body = contents
            .replace(/(from\s+['"])(?![\.\/])/g, '$1/@modules/')
            .replace(/process\.env\.NODE_ENV/g, 'development')
    }
})

app.listen(3000)
console.log('Server running @ http://localhost:3000');