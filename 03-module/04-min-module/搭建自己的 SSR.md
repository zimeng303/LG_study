@[TOC](搭建自己的 SSR)

# Vue SSR 

## 基本介绍

### Vue SSR 是什么

* 官方文档：[https://ssr.vuejs.org/](https://ssr.vuejs.org/)
* Vue SSR（Vue.js Server-Side Rendering）是 Vue.js 官方提供的一个服务端渲染（同构应用）解决方案
* 使用它可以构建同构应用
* 还是基于原有的 Vue.js 技术栈

官方文档的解释：

> Vue.js 是构建客户端应用程序的框架。默认情况下，可以在浏览器中输出 Vue 组件，进行生成 DOM 和操作 DOM。然而，也可以将同一个组件渲染为服务器端的 HTML 字符串，将它们直接发送到浏览器，最后将这些静态标记"激活"为客户端上完全可交互的应用程序。 
>
> 服务器渲染的 Vue.js 应用程序也可以被认为是"同构"或"通用"，因为应用程序的大部分代码都可以在服务器和客户端上运行。

### 使用场景

在对你的应用程序使用服务器端渲染 (SSR) 之前，你应该问的第一个问题是，是否真的需要它。

技术层面：

* 更快的首屏渲染速度
* 更好的 SEO

业务层面：

* 不适合管理系统
* 适合门户资讯类网站，例如企业官网、知乎、简书等
* 适合移动网站

### 如何实现 Vue SSR

1. **基于 Vue SSR 官方文档提供的解决方案**

   官方方案具有更直接的控制应用程序的结构，更深入底层，更加灵活，同时在使用官方方案的过程中， 也会对Vue SSR有更加深入的了解。

   该方式需要你熟悉 Vue.js 本身，并且具有 Node.js 和 webpack 的相当不错的应用经验。

2. **Nuxt.js 开发框架**

   NUXT提供了平滑的开箱即用的体验，它建立在同等的Vue技术栈之上，但抽象出很多模板，并提供了 一些额外的功能，例如静态站点生成。通过 Nuxt.js 可以快速的使用 Vue SSR 构建同构应用。

## 基本使用

接下来我们以 Vue SSR 的官方文档为参考，来学习一下它的基本用法。

### 渲染一个 Vue 实例

>目标：
>
>* 了解如何使用 VueSSR 将一个 Vue 实例渲染为 HTML 字符串

首先，我们来学习一下服务端渲染中最基础的工作：**模板渲染**。 说白了就是如何在服务端使用 Vue 的方式解析替换字符串。

在它的官方文档中其实已经给出了示例代码，下面我们来把这个案例的实现过程以及其中含义演示一 下。

* 准备工作

  ```powershell
  # 创建文件夹
  mkdir vue-ssr
  # 进入创建的文件夹内
  cd vue-ssr
  # 初始化包管理文件 package.json
  npm init -y # -y 表示快速初始，不经过一些问题的回答，直接走默认回答
  # 安装 vue 及 vue-server-renderer 依赖包
  npm i vue vue-serve-renderer
  ```

* 创建 `server.js 文件`，将 Vue 实例渲染成 HTML 字符串

  ```js
  // 第 1 步：创建一个 Vue 实例
  const Vue = require('vue')
  const app = new Vue({
      template: `
          <div id="app">
          	<h1>{{ message }}</h1>
          </div>
  	`,
      data: {
          message: '拉勾教育'
      }
  })
  
  // 第 2 步：创建一个 renderer 渲染器
  const renderer = require('vue-server-renderer').createRenderer()
  
  /**
   * @param {Vue} app
   * @param {Function} 
   */
  // 第 3 步：将 Vue 实例渲染为 HTML
  renderer.renderToString(app, (err, html) => {
      if (err) throw err
      // html 就是渲染出来的结果字符串
      console.log(html);
      // <div id="app" data-server-rendered="true"><h1>拉勾教育</h1></div>
  })
  
  // 在 2.5.0+，如果没有传入回调函数，则会返回 Promise：
  renderer
      .renderToString(app)
      .then((html) => {
      	console.log(html); 
  	})
      .catch((err) => {
      	console.error(err); 
  	});
  ```

* 使用 node 运行 server.js

  ```powershell
  node server.js
  ```

  执行效果，如图所示：

  ![image-20210118085426285](C:\Users\86135\AppData\Roaming\Typora\typora-user-images\image-20210118085426285.png)

### 结合到 Web 服务中

在 Node.js 服务器中使用时相当简单直接，例如 `Express`。 

* 首先，安装 `Express` 到项目中：

  ```powershell
  npm i express
  ```

* 然后，使用 Express 创建一个基本的 Web 服务：

  ```js
  const express = require("express"); 
  const app = express();
  app.get("/", (req, res) => {  
      res.send("Hello World!"); 
  });
  app.listen(3000, () => console.log("app listening at http://localhost:port"));
  ```

* 启动 Web 服务，`nodemon` 启动服务，可以实时监听，热更新：

  ```powershell
  nodemon server.js
  ```

* 在 Web 服务中渲染 Vue 实例：

  ```js
  const Vue = require('vue')
  const express = require('express')
  
  // 创建一个渲染器
  const renderer = require('vue-server-renderer').createRenderer()
  
  // 创建一个 experss 的 server 实例
  const server = express()
  
  // 添加路由
  server.get('/', (req, res) => {
      const app = new Vue({
          template: `
              <div id="app">
              	<h1>{{ message }}</h1>
              </div>
  		`,
          data: {
              message: '拉勾教育'
          }
      })
  
      renderer.renderToString(app, (err, html) => {
          if (err) {
              return res.status(500).end('Internal Server Error')
          }
          // html 就是渲染出来的结果字符串
          res.end(html)
      })
  })
  
  server.listen(3000, () => {
      console.log('server running at port 3000');
  })
  ```

  浏览器访问结果，如图所示：

  ![image-20210118091013905](C:\Users\86135\AppData\Roaming\Typora\typora-user-images\image-20210118091013905.png)

  请求响应数据，如图所示：

  ![image-20210118091431323](C:\Users\86135\AppData\Roaming\Typora\typora-user-images\image-20210118091431323.png)

* 解决上面出现的乱码问题，添加 `html响应头`，或 使用 `meta` 设置编码格式

  ```js
  ......
  server.get('/', (req, res) => {
  	......
      renderer.renderToString(app, (err, html) => {
          if (err) {
              return res.status(500).end('Internal Server Error')
          }
          // html 就是渲染出来的结果字符串
          // 添加响应头，解决编码问题
          res.setHeader('Content-Type', 'text/html; charset=utf8')
          res.end(`
              <!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Document</title>
              </head>
              <body>
                  ${html}
              </body>
              </html>
          `)
      })
  })
  ......
  ```

  > <font color="#f00">建议：</font>
  >
  > ​	将上述的两种解决编码的方案，都保留

**使用一个页面模板**

* 创建一个页面模板 `index.template.html`，优化上述代码

  ```html
  <!DOCTYPE html>
  <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
      </head>
      <body>
          <!--vue-ssr-outlet-->
      </body>
  </html>
  ```

  > <font color="#f00">注意：</font>
  >
  > * 上面的 `<!--vue-ssr-outlet-->` 注释语句，是固定语法。会作为 Vue实例 转换的 html 字符串存放的位置，类似于占位。
  > * `vue-ssr-outlet` 前后不可以有空格。

* 在 `server.js` 中，创建 `renderer` 渲染器时，添加一个参数，指定模板

  ```js
  const Vue = require('vue')
  const express = require('express')
  const fs = require('fs') // 读取文件
  
  // 创建一个渲染器
  const renderer = require('vue-server-renderer').createRenderer({
      // 设置模板
      template: fs.readFileSync('./index.template.html', 'utf-8')
  })
  
  // 创建一个 experss 的 server 实例
  const server = express()
  
  // 添加路由
  server.get('/', (req, res) => {
      ......
      renderer.renderToString(app, (err, html) => {
          ......
          // 结合了模板的完整内容
          res.end(html)
      })
  })
  
  server.listen(3000, () => {
      console.log('server running at port 3000');
  })
  ```

* 访问浏览器，查看响应数据，如图所示：

  ![image-20210118100501475](C:\Users\86135\AppData\Roaming\Typora\typora-user-images\image-20210118100501475.png)

**在模板中使用外部数据**

* `server.js`，在使用 `renderer` 渲染器进行渲染时，传入第二个参数(可选的)，配置传入到模板中的数据

  ```js
  renderer.renderToString(app, {
          // 配置传到模板中的数据
          title: '拉勾教育',
          meta: `<meta name="description" content="拉勾教育">`
      }, (err, html) => {
      ......
  })
  ```

* `index.template.html`，使用 vue 中的模板引擎的语法，进行渲染

  ```html
  {{{ meta }}}
  <title>{{ title }}</title>
  ```

  > `{{{ }}}` 表示原文输出 

# 构建同构渲染

* 官网地址：[[https://ssr.vuejs.org/zh/guide/structure.html#%E4%BD%BF%E7%94%A8-webpack-%E7%9A%84%E6%BA%90%E7%A0%81%E7%BB%93%E6%9E%84](https://ssr.vuejs.org/zh/guide/structure.html#使用-webpack-的源码结构)]([https://ssr.vuejs.org/zh/guide/structure.html#%E4%BD%BF%E7%94%A8-webpack-%E7%9A%84%E6%BA%90%E7%A0%81%E7%BB%93%E6%9E%84](https://ssr.vuejs.org/zh/guide/structure.html#使用-webpack-的源码结构))

## 构建流程

![image-20210118102909217](C:\Users\86135\AppData\Roaming\Typora\typora-user-images\image-20210118102909217.png)

## 源码结构

我们需要使用 `webpack` 来打包我们的 Vue 应用程序。事实上，我们可能需要在服务器上使用 `webpack` 打包 Vue 应用程序，因为：

* 通常 Vue 应用程序是由 `webpack` 和  `vue-loader` 构建，并且许多 `webpack` 特定功能 不能直接在 `Node.js` 中运行（例如通过 `file-loader` 导入文件，通过   `css-loader` 导入 CSS）。
* 尽管 `Node.js` 最新版本能够完全支持 `ES2015` 特性，我们还是需要转译客户端代码以适应老版浏览器。这也会涉及到构建步骤。

所以基本看法是，对于客户端应用程序和服务器应用程序，我们都要使用 `webpack` 打包 - 服务器需要 「服务器 bundle」然后用于服务器端渲染(SSR)，而「客户端 bundle」会发送给浏览器，用于混合静态标记。

现在我们正在使用 `webpack` 来处理服务器和客户端的应用程序，大部分源码可以使用通用方式编写，可以使用 `webpack` 支持的所有功能。同时，在编写通用代码时，有一些事项要牢记在心。

一个基本项目可能像是这样：

```markdown
src
├── components 
│   ├── Foo.vue 
│   ├── Bar.vue 
│   └── Baz.vue 
├── App.vue
├── app.js # 通用    entry(universal entry) 
├── entry-client.js # 仅运行于浏览器
└── entry-server.js # 仅运行于服务器
```

### <font color="#f00">App.vue</font>

* `src/App.vue`

  ```html
  <template>
      <div id="app">
          <h1>{{ message }}</h1>
          <h2>客户端动态交互</h2>
          <div>
              <input v-model="message" />
          </div>
          <div>
              <button @click="onClick">点击测试</button>
          </div>
      </div>
  </template>
  
  <script>
      export default {
          name: "App",
          data () {
              return { 
                  message: "拉勾教育",
              }
          },
          methods: {
              onClick() {
                  console.log("Hello World");
              },
          },
      };
  </script>
  ```

### <font color="#f00">app.js</font>

`app.js` 是我们应用程序的「通用 entry」。在纯客户端应用程序中，我们将在此文件中创建根 Vue 实例，并直接挂载到 DOM。但是，对于服务器端渲染(SSR)，责任转移到纯客户端 entry 文件。`app.js` 简单地使用 export 导出一个 `createApp` 函数：

* `src/app.js`

  ```js
  import Vue from 'vue'
  import App from './App.vue'
  
  // 导出一个工厂函数，用于创建新的
  // 应用程序、router 和 store 实例
  export function createApp() {
      const app = new Vue({
          // 根实例简单的渲染应用程序组件。
          render: h => h(App)
      })
      // 后期还有导出 router 、store实例
      return { app }
  }
  ```

### <font color="#f00">entry-client.js</font>

客户端 `entry` 只需创建应用程序，并且将其挂载到 DOM 中：

* `src/entry-client.js`

  ```js
  /**
   * 客户端入口
   */
  import { createApp } from './app'
  
  // 客户端特定引导逻辑……
  
  const { app } = createApp()
  
  // 这里假定 App.vue 模板中根元素具有 `id="app"`
  app.$mount('#app')
  ```

### <font color="#f00">entry-server.js</font>

服务器 entry 使用 default export 导出函数，并在每次渲染中重复调用此函数。此时，除了创建和返回 应用程序实例之外，它不会做太多事情 - 但是稍后我们将在此执行服务器端路由匹配 (server-side route matching) 和数据预取逻辑 (data pre-fetching logic)。

* `src/entry-server.js`

  ```js
  /**
   * 服务端启动入口
   */
  
  import { createApp } from './app'
  
  export default context => {
      const { app } = createApp()
  
      // 服务端路由处理、数据预取...
      return app
  }
  ```

## 构建配置

### 安装依赖

* 1，安装生产依赖

  ```powershell
  npm i vue vue-server-renderer express cross-env
  ```

  > 说明
  >
  > | 包                  | 说明                                                    |
  > | ------------------- | ------------------------------------------------------- |
  > | vue                 | Vue.js 核心库                                           |
  > | vue-server-renderer | Vue 服务端渲染工具                                      |
  > | express             | 基于 Node 的 Web 服务框架                               |
  > | cross-env           | 通过 npm scripts 设置跨平台环境变量，区分不同的打包环境 |

* 2，安装开发依赖

  ```powershell
  npm i -D webpack webpack-cli webpack-merge webpack-node-externals @babel/core @babel/plugin-transform-runtime @babel/preset-env babel-loader css-loader url-loader file-loader rimraf vue-loader vue-template-compiler friendly-errors-webpack-plugin
  ```

  > 说明
  >
  > | 包                                                           | 说明                                                |
  > | ------------------------------------------------------------ | --------------------------------------------------- |
  > | webpack                                                      | webpack 核心包                                      |
  > | webpack-cli                                                  | webpack 的命令行工具                                |
  > | webpack-merge                                                | webpack 配置信息合并工具                            |
  > | webpack-node-externals                                       | 排除 webpack 中的 Node 模块                         |
  > | rimraf                                                       | 基于 Node 封装的一个跨平台 <kbd>`rm -rf`</kbd> 工具 |
  > | friendly-errors- webpack-plugin                              | 友好的 `webpack ` 错误提示                          |
  > | @babel/core<br />@babel/plugin-transform-runtime<br />@babel/preset-env<br />babel-loader | <br /><br />Babel 相关工具                          |
  > | vue-loader<br />vue-template-compiler                        | 处理 .vue 资源                                      |
  > | file-loader                                                  | 处理字体资源                                        |
  > | css-loader                                                   | 处理 CSS 资源                                       |
  > | url-loader                                                   | 处理图片资源                                        |

### 配置文件
1. **初始化 `webpack` 打包配置文件**

   ```markdown
   build
   ├── webpack.base.config.js # 公共配置
   ├── webpack.client.config.js # 客户端打包配置文件 
   └── webpack.server.config.js # 服务端打包配置文件
   ```

* `build/webpack.base.config.js`

  ```js
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
  ```

* `build/webpack.client.config.js`

  ```js
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
  ```

* `build/webpack.server.config.js`

  ```js
  /**
  * 服务端打包配置 
  */
  const { merge } = require('webpack-merge')
  const nodeExternals = require('webpack-node-externals')
  const baseConfig = require('./webpack.base.config.js')
  const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
  
  module.exports = merge(baseConfig, {
      // 将 entry 指向应用程序的 server entry 文件  
      entry: './src/entry-server.js',
  
      // 这允许 webpack 以 Node 适用方式处理模块加载  
      // 并且还会在编译 Vue 组件时，
      // 告知 vue-loader 输送面向服务器代码(server-oriented code)。  
      target: 'node',
  
      output: {
          filename: 'server-bundle.js',
          // 此处告知 server bundle 使用 Node 风格导出模块(Node-style exports)    
          libraryTarget: 'commonjs2'
      },
      // 不打包 node_modules 第三方包，而是保留 require 方式直接加载  
      externals: [nodeExternals({
          // 白名单中的资源依然正常打包    
          allowlist: [/\.css$/]
      })],
      plugins: [
          // 这是将服务器的整个输出构建为单个 JSON 文件的插件。   
          // 默认文件名为 `vue-ssr-server-bundle.json`   
        new VueSSRServerPlugin()
      ]
  })
  ```

### 打包命令

2. **在 `npm scripts` 中配置打包命令**

   ```json
   "scripts": {
       "build:client": "cross-env NODE_ENV=production webpack --config build/webpack.client.config.js",
       "build:server": "cross-env NODE_ENV=production webpack --config build/webpack.server.config.js",
       "build": "rimraf dist && npm run build:client && npm run build:server"
   },
   ```

### 运行测试

* **客户端打包**，命令执行及输出结果如下：

  ```powershell
  npm run build:client
  ```

  ![image-20210118231101447](C:\Users\86135\AppData\Roaming\Typora\typora-user-images\image-20210118231101447.png)

* **服务端打包**，命令执行及输出结果如下：

  ```powershell
  npm run build:server
  ```

  ![image-20210118230754259](C:\Users\86135\AppData\Roaming\Typora\typora-user-images\image-20210118230754259.png)

* 同时打包客户端和服务端，命令执行及输出结果如下：

  ```powershell
  npm run build
  ```

  ![image-20210118230959311](C:\Users\86135\AppData\Roaming\Typora\typora-user-images\image-20210118230959311.png)

### 启动应用

* 参考网址：[https://ssr.vuejs.org/zh/guide/bundle-renderer.html](https://ssr.vuejs.org/zh/guide/bundle-renderer.html)

* `server.js`

  ```js
  const Vue = require('vue')
  const express = require('express')
  const fs = require('fs')
  
  const serverBundle = require('./dist/vue-ssr-server-bundle.json')
  const template = fs.readFileSync('./index.template.html', 'utf-8')
  // 生成的客户端清单 (client manifest) 
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  // 创建一个渲染器
  const renderer = require('vue-server-renderer').createBundleRenderer(serverBundle, {
      // 设置模板
      template,
      clientManifest
  })
  
  // 创建一个 experss 的 server 实例
  const server = express()
  
  // 开头的路径，需要与 output 中设置的 publicPath 保持一致
  server.use('/dist', express.static('./dist'))
  
  // 添加路由
  server.get('/', (req, res) => {
      /**
       * @param {Vue} 
       * @param {Object} 
       * @param {Function} 
       */
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
  })
  
  server.listen(3000, () => {
      console.log('server running at port 3000');
  })
  ```

### 解析渲染流程
#### 服务端渲染
* renderer.renderToString 渲染了什么？
* renderer 是如何拿到 entry-server 模块的？
  * createBundleRenderer 中的 serverBundle 
* server Bundle 是 Vue SSR 构建的一个特殊的 JSON 文件
  * entry：入口
  * files：所有构建结果资源列表 <font color="#f00">（server-bundle.js: 即 entry-server.js 的打包结果）</font>
  * maps：源代码 source map 信息
* server-bundle.js 就是通过 server.entry.js 构建出来的结果文件 
* 最终把渲染结果注入到模板中

#### 客户端渲染
* vue-ssr-client-manifest.json
  * publicPath：访问静态资源的根相对路径，与 webpack 配置中的 publicPath 一致 
  * all：打包后的所有静态资源文件路径
  * initial：页面初始化时需要加载的文件，会在页面加载时配置到 preload 中 
  * async：页面跳转时需要加载的文件，会在页面加载时配置到 prefetch 中
  * modules：项目的各个模块包含的文件的序号，对应 all 中文件的顺序；moduleIdentifier和 all数组中文件的映射关系（modules对象是我们查找文件引用的重要数据）

## 构建开发模式

我们现在已经实现同构应用的基本功能了，但是这对于一个完整的应用来说还远远不够，例如如何处理同构应用中的路由、如何在服务端渲染中进行数据预取等功能。这些功能我们都会去对它进行实现，但 是在实现它们之前我们要先来解决一个关于打包的问题：

* 每次写完代码，都要重新打包构建 
* 重新启动 Web 服务
* 很麻烦...

所以下面我们来实现项目中的开发模式构建，也就是我们希望能够实现：

* 写完代码，自动构建 
* 自动重启 Web 服务 
* 自动刷新页面内容
* ...

### 基本思路

* 生产模式
  * npm run build 构建 
  * node server.js 启动应用
* 开发模式
  * 监视代码变动自动构建，热更新等功能 
  * node server.js 启动应用

所以我们设计了这样的启动脚本：

* `package.json`

  ```json
  "scripts": {
      ...
      // 启动开发服务
      "dev": "node server.js",  // 启动生产服务
      "start": "cross-env NODE_ENV=production && node server.js" 
  }
  ```

* 服务端配置，`server.js`

  ```js
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
  server.use('/dist', express.static('./dist'))
  
  const isProd = process.env.NODE_ENV === 'production'
  
  let renderer
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
      
  }
  // 这里无需传入一个应用程序，因为在执行    bundle 时已经自动创建过。  
  // 现在我们的服务器与应用程序已经解耦！
  // bundle renderer 在调用    renderToString 时，
  // 它将自动执行「由 bundle 创建的应用程序实例」所导出的函数（传入上下文作为参数），然后渲染 它。
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
      })
  
  server.listen(3000, () => {
      console.log('server running at port 3000');
  })
  ```

### 封装处理模块

* `build/setup-dev-server.js`，开发模式，自动构建，更新 Renderer 渲染器

  ```js
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
  
      // 监视构建 serverBundle --> 调用 update --> 更新 Renderer 渲染器
  
      // 监视构建 clientManifest --> 调用 update --> 更新 Renderer 渲染器
      return onReady
  }
  ```

* `server.js`，完善开发模式所要执行的操作

  ```js
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
  ```

### 更新模板
* 关于 Node 中的监视的问题：

  * fs.watch
  * fs.watchFile
  * 第三方包：[chokidar](https://github.com/paulmillr/chokidar)

* 安装第三方包：[chokidar](https://github.com/paulmillr/chokidar)

  ```powershell
  npm i -D chokidar
  ```

* `build/setup-dev-server.js`，监视构建 template，更新 Renderer 渲染器

  ```js
  // 监视构建 template --> 调用 update --> 更新 Renderer 渲染器
  const templatePath = resolve('../index.template.html')
  template = fs.readFileSync(templatePath, 'utf-8')
  console.log(template);
  // fs.watch、fs.watchFile
  // chokidar 第三方包，监听文件的变化
  chokidar.watch(templatePath).on('change', () => {
      template = fs.readFileSync(templatePath, 'utf-8')
      update()
  })
  ```

  > <font color="#f00">注意：</font>使用 `chokidar` 监视文件变化在 `vscode` 中有问题，不影响整体功能。

### 更新服务端打包

* `build/setup-dev-server.js`，监视构建 serverBundle，更新 Renderer 渲染器

  ```js
  const webpack = require('webpack') // 引入 webpack
  
  // 监视构建 serverBundle --> 调用 update --> 更新 Renderer 渲染器
  const serverConfig = require('./webpack.server.config')
  const serverCompiler = webpack(serverConfig)
  serverCompiler.watch({
      // 监视打包的可选配置参数
  }, (err, stats) => {
      if (err) throw err // webpack 配置信息报错
      // stats 结果模块构建出的相关对象
      if (stats.hasErrors()) return // 源代码中存在错误
      serverBundle = JSON.parse(
          fs.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8')
      )
      update()
  })
  ```

### 将打包结果存储到内存中
webpack 默认会把构建结果存储到**磁盘**中，对于生产模式构建来说是没有问题的；但是我们在开发模 式中会频繁的修改代码触发构建，也就意味着要频繁的操作磁盘数据，而磁盘数据操作相对来说是比较慢的，所以我们有一种更好的方式，就是 **把数据存储到内存** 中，这样可以极大的提高构建的速度。

[memfs](https://github.com/streamich/memfs) 是一个兼容 Node 中 fs 模块 API 的内存文件系统，通过它我们可以轻松的实现把 webpack 构 建结果输出到内存中进行管理。

方案一：自己配置 [memfs](https://github.com/streamich/memfs)。

* 安装第三方包：[memfs](https://github.com/streamich/memfs)

  ```powershell
  npm install -D memfs
  ```

* `build/setup-dev-server.js`，监视构建 serverBundle，更新 Renderer 渲染器

  ```js
  const { createFsFromVolume, Volume } = require('memfs') 
  
  // 自定义 webpack 把数据写入内存中
  serverCompiler.outputFileSystem = createFsFromVolume(new Volume()) 
  // memfs 模块去除了 join 方法，所以这里我们需要手动的给它提供 join 方法
  serverCompiler.outputFileSystem.join = path.join.bind(path) serverCompiler.watch({
  	// 监视构建的配置选项
  }, (err, stats) => {
      // 每当构建成功，就会执行该回调函数  
      if (err) {
          throw err 
      }
  	if (stats.hasErrors()) return                    
  // 读取打包之后的最新结果 
  	serverBundle = JSON.parse(
      	serverCompiler.outputFileSystem.readFileSync(resolve('../dist/vue- ssr-server-bundle.json'), 'utf-8')
      )
  	// update 更新  
      update()
  })
  ```

方案二：使用  [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware)。

[webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) 作用是，以监听模式启动 `webpack`，将编译结果输出到内存中，然后将内存文件输出到 `Express` 服务中。

* 安装依赖：[webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) 

  ```powershell
  npm i -D webpack-dev-middleware
  ```

* 配置到构建流程中，`build/setup-dev-server.js`

  ```js
  const devMiddleware = require('webpack-dev-middleware')
  
  // 监视构建 serverBundle --> 调用 update --> 更新 Renderer 渲染器
  const serverConfig = require('./webpack.server.config')
  // webpack 构建实例
  const serverCompiler = webpack(serverConfig)
  const serverDevMiddleware = devMiddleware(serverCompiler, {
      // 配置 webpack-dev-middleware 选项
      logLevel: 'silent' // 关闭日志输出 4.0.0+ 不支持，由 FriendlyErrorsWebpackPlugin 处理
  })
  // 调用钩子，注册插件 
  serverCompiler.hooks.done.tap('server', () => {
      // serverDevMiddleware.fileSystem 操作内存中的文件，类似于 fs(操纵磁盘中的文件)
      serverBundle = JSON.parse(    
          serverDevMiddleware.fileSystem.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8')
      )
      update()
  })
  ```

### 更新客户端打包

客户端打包和服务端打包类似，都是借助于 [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) 

* `build/setup-dev-server.js`，

  ```js
  // 监视构建 clientManifest --> 调用 update --> 更新 Renderer 渲染器
  const clientConfig = require('./webpack.client.config')
  // webpack 构建实例
  const clientCompiler = webpack(clientConfig)
  const clientDevMiddleware = devMiddleware(clientCompiler, {
      // 重要！输出资源的访问路径前缀，应该和 客户端打包输出的 publicPath 一致
      publicPath: clientConfig.output.publicPath,
      logLevel: 'silent' // 关闭日志输出 4.0.0+ 不支持，由 FriendlyErrorsWebpackPlugin 处理
  })
  // 调用钩子，注册插件 
  clientCompiler.hooks.done.tap('client', () => {    
      // clientDevMiddleware.fileSystem 操作内存中的文件，类似于 fs(操纵磁盘中的文件)
      clientManifest = JSON.parse(
          clientDevMiddleware.fileSystem.readFileSync(resolve('../dist/vue-ssr-client-manifest.json'), 'utf-8')
      )
      update()
  })
  
  // 重要！！！将 clientDevMiddleware 挂载到 Express 服务中，提供对其内部内存中数据的访问
  server.use(clientDevMiddleware)
  ```

### 热更新
热更新功能需要使用到 [webpack-hot-middleware](https://github.com/webpack-contrib/webpack-hot-middleware) 工具包。 

* 安装依赖：

  ```powershell
  npm install -D webpack-hot-middleware
  ```

* `build/setup-dev-server.js`，配置热更新

  ```js
  const hotMiddleware = require('webpack-hot-middleware')
  // 监视构建 clientManifest --> 调用 update --> 更新 Renderer 渲染器
  const clientConfig = require('./webpack.client.config')
  
  // ====================== 热更新配置 ============================
  clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
  clientConfig.entry.app = [
      'webpack-hot-middleware/client?quiet=true&reload=true', // 和服务端交互处理热更新一个客户端脚本
      clientConfig.entry.app // 本来的脚本
  ]
  clientConfig.output.filename = '[name].js' // 热更新模式下确保一致的 hash，即不设置hash
  // ====================== /热更新配置 ============================
  
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
          clientDevMiddleware.fileSystem.readFileSync(resolve('../dist/vue-ssr-client-manifest.json'), 'utf-8')
      )
      update()
  })
  
  server.use(hotMiddleware(clientCompiler, {
      log: false // 关闭它本身的日志输出
  }))
  
  ```

**工作原理：**

* 中间件将自身安装为 `webpack` 插件，并侦听编译器事件。
* 每个连接的客户端都有一个 `Server Sent Events` 连接，服务器将在编译器事件上向连接的客户端 发布通知。
  * [MDN - 使用服务器发送事件](https://developer.mozilla.org/zh-cn/docs/server-sent_events/using_server-sent_events) 
  * [Server-Sent Events 教程](http://www.ruanyifeng.com/blog/2017/05/server-sent_events.html)
* 当客户端收到消息时，它将检查本地代码是否为最新。如果不是最新版本，它将触发 webpack 热 模块重新加载。









