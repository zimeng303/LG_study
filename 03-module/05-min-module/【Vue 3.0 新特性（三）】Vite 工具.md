@[TOC](Vite 实现原理)

## Vite 工具

**基本概念**

* Vite 是一个面向现代浏览器的一个更轻、更快的 Web 应用开发工具
* 它基于 ECMAScript 标准原生模块系统（ES Modules）实现

**ES Module**

* 现代浏览器都支持 ES Module（IE不支持）

* 通过下面的方式加载模块

  ```html
  <script type="module" src="..."></script>
  ```

* 支持模块的 `script` 默认延迟加载

  * 类似于 `script` 标签设置 `defer`
  * 在文档解析完成后，触发 `DOMContentLoaded` 事件前执行

**Vite as Vue-CLI**

* `Vite` 在开发模式下不需要打包可以直接运行

* `Vue-CLI` 开发模式下必须对项目打包才可以运行

* `Vite` 在生产环境下使用 Rollup 的方式打包

  * 基于 `ES Module` 的方式打包

* Vue-CLI 使用 Webpack 打包

* Vite 启动服务 `vite serve`

  ![image-20210207171656478](F:\LaGou\03-module\05-min-module\assets\image-20210207171656478.png)

* `Vue-CLI` 启动服务 `vue-cli-service serve`

  ![image-20210207171727352](F:\LaGou\03-module\05-min-module\assets\image-20210207171727352.png)

**开箱即用**

* TypeScript - 内置支持
* less/sass/stylus/postcss - 内置支持（需要单独安装）
* JSX
* Web Assembly

**HMR**

* Vite HMR
  * 立即编译当前所修改的文件
* Webpack HMR
  * 会自动以这个文件为入口重写 build 一次，所有的涉及到的依赖也都会被加载一遍

**Vite  特点**

* 快速冷启动
  * 解决 webpack 冷启动慢
* 按需编译
* 模块热更新
  * 解决 webpack 热更新速度慢
* 开箱即用
  * 避免各种 loader 以及 plugins 的配置

**项目依赖**

* Vite
* @vue/compiler-sfc：编译项目中的 `.vue` 结尾的单文件组件

**Vite 创建项目**

* Vite 创建项目

  ```powershell
  npm init vite-app <project-name>
  cd <project-name>
  npm install
  npm run dev
  ```

* 基于模板创建项目

  ```powershell
  npm init vite-app --template react
  npm init vite-app --template preact
  ```

**Vite 核心功能**

* 静态 Web 服务器
* 编译单文件组件
  * 拦截浏览器不识别的模块，并处理
* HMR

**静态 Web 服务器**

```js
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
```

