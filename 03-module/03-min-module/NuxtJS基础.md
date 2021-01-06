@[TOC](NuxtJS 基础)

# Nuxt.js 的基本介绍 

* 官网：[https://zh.nuxtjs.org/](https://zh.nuxtjs.org/)
* GitHub 仓库：[https://github.com/nuxt/nuxt.js](https://github.com/nuxt/nuxt.js)

## Nuxt.js 是什么 

Nuxt.js 是一个基于 Vue.js 的服务端渲染应用框架，它可以帮我们轻松的实现同构应用。

通过对客户端/服务端基础架构的抽象组织，Nuxt.js 主要关注的是应用的 **UI渲染**。 

我们的目标是创建一个灵活的应用框架，你可以基于它初始化新项目的基础结构代码，或者在已有 Node.js 项目中使用 Nuxt.js。 

Nuxt.js 预设了利用 Vue.js 开发**服务端渲染**的应用所需要的各种配置。

除此之外，我们还提供了一种命令叫：`nuxt generate`，为基于 Vue.js 的应用提供生成对应的静态站点的功能。 

我们相信这个命令所提供的功能，是向开发集成各种微服务（Microservices）的 Web 应用迈开的新一 步。 

作为框架，Nuxt.js 为 `客户端/服务端` 这种典型的应用架构模式提供了许多有用的特性，例如异步数据 加载、中间件支持、布局支持等非常实用的功能。 

## 基本特性 

* 基于 Vue.js 
  * Vue、Vue Router、Vuex、Vue SSR 
* 自动代码分层 
* 服务端渲染 
* 强大的路由功能，支持异步数据 
* 静态文件服务 
* ES2015+ 语法支持 
* 打包和压缩 JS 和 CSS 
* HTML 头部标签管理 
* 本地开发支持热加载 
* 集成 ESLint 
* 支持各种样式预处理器： SASS、LESS、 Stylus 等等 
* 支持 HTTP/2 推送 

## Nuxt.js 框架是如何运作的 

![image-20210106135621485](C:\Users\86135\AppData\Roaming\Typora\typora-user-images\image-20210106135621485.png)

Nuxt.js 集成了以下组件/框架，用于开发完整而强大的 Web 应用： 

* Vue.js 
* Vue Router 
* Vuex 
* Vue Server Renderer 

压缩并 gzip 后，总代码大小为：57kb（如果使用了 Vuex 特性的话为 60kb）。 

另外，Nuxt.js 使用 Webpack 和 vue-loader、babel-loader 来处理代码的自动化构建工作（如打包、 代码分层、压缩等等）。 

# Nuxt.js 的使用方式

* 初始项目
* 已有的 Node.js 服务端项目
  * 直接把 Nuxt 当作一个中间件集成到 Node Web Server 中
* 现有的 Vue.js 项目
  * 非常熟悉 Nuxt.js
  * 至少百分之十的代码改动

## 创建项目 

官方文档：[https://zh.nuxtjs.org/docs/2.x/get-started/installation](https://zh.nuxtjs.org/docs/2.x/get-started/installation)

Nuxt 提供了两种方式用来创建项目： 

* 使用 create-nuxt-app 脚手架工具 
* 手动创建项目

### 手动创建项目

#### 项目准备工作

* 在 cmd 命令行，进行如下操作：

  ```powershell
  # 创建示例项目 
  mkdir 01-nuxtjs-demo 
  # 进入示例项目目录中 
  cd 01-nuxtjs-demo  
  # 初始化 package.json 文件 
  npm init -y 
  # 安装 nuxt 
  npm innstall nuxt --save
  ```

* 在 `package.json` 文件的 `scripts` 中新增： 

  ```json
  {
      "scripts": {
          "dev": "nuxt"
      }
  }
  ```

  上面的配置使得我们可以通过运行 `npm run dev` 来运行 nuxt。 

#### 创建页面及启动项目 

* 创建 `pages` 目录，用来存放视图页面： 

  ```powershell
  mkdir pages 
  ```

  > <font color="#f00">pages 是固定写法，不可更改</font>

* 创建页面 `pages/index.vue`： 

  ```html
  <template> 
      <h1>Hello world!</h1> 
  </template> 
  ```

* 运行命令，启动项目：

  ```powershell
  npm run dev 
  ```

现在我们的应用运行在  http://localhost:3000 上运行。 

> 注意：Nuxt.js 会监听 pages 目录中的文件更改，因此在添加新页面时无需重新启动应用程序。 

#### Nuxt 中的基础路由 

Nuxt.js 会依据 `pages` 目录中的所有 ` *.vue` 文件生成应用的路由配置。 

假设   pages 的目录结构如下：

```markdown
pages/ 
--| user/ 
-----| index.vue -----| one.vue 
--| index.vue
```

