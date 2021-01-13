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

![image-20210106135621485](F:\LaGou\03-module\03-min-module\assets\image-20210106135621485.png)

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

#### Nuxt 路由 

Nuxt.js 会依据 `pages` 目录中的所有 ` *.vue` 文件生成应用的路由配置。 

#### 基础路由

* 假设 `pages` 的目录结构如下：

```markdown
pages/ 
--| user/ 
-----| index.vue 
-----| one.vue 
--| index.vue
```

目录结果，如图所示：

![image-20210107144737957](F:\LaGou\03-module\03-min-module\assets\image-20210107144737957.png)

* 那么，Nuxt.js 自动生成的路由配置如下： 

```js
router: { 
    routes: [ 
        { 
            name: 'index', 
            path: '/', 
            component: 'pages/index.vue' 
        }, 
        { 
            name: 'user', 
            path: '/user', 
            component: 'pages/user/index.vue' 
        }, 
        { 
            name: 'user-one', 
            path: '/user/one', 
            component: 'pages/user/one.vue' 
        } 
    ] 
} 
```

* 此处的 `user` 目录名称，就是 **`路由名称`**，浏览器访问地址为：http://localhost:3000/user，即默认访问 `pages/user/index.vue` 页面

  ![image-20210107145047133](F:\LaGou\03-module\03-min-module\assets\image-20210107145047133.png)

* `pages/user/one.vue`，访问地址为：http://localhost:3000/user/one

  ![image-20210107145304360](F:\LaGou\03-module\03-min-module\assets\image-20210107145304360.png)

#### 路由导航 

* a 标签 
  
  * 它会刷新整个页面，不推荐使用
  
  ```html
  <!-- a 链接，刷新导航，走服务端渲染 -->
  <a href="/">首页</a>
  ```
  
* <font color="#f00"><nuxt-link> </font> 组件 
  
  * 和 Vue Router 中的 <router-link> 组件 用法一样
  * [https://router.vuejs.org/zh/api/#router-link](https://router.vuejs.org/zh/api/#router-link)
  
  ```html
  <!-- router-link 导航链接组件 -->
  <router-link to="/">首页</router-link>
  
  <!-- nuxt-link 导航链接组件 -->
  <nuxt-link to="/">首页</nuxt-link>
  ```
  
* 编程式导航 

  * 和 Vue Router 中的 编程式导航 用法一样

  * [https://router.vuejs.org/zh/guide/essentials/navigation.html](https://router.vuejs.org/zh/guide/essentials/navigation.html)

  ```html
  <!-- 编程式导航 -->
  <button @click="onClick">首页</button>
  ```

  ```js
  methods: {
      onClick () {
          this.$router.push('/')
      }
  }
  ```

#### 动态路由 

* Vue Router 动态路由匹配
  * [https://router.vuejs.org/zh/guide/essentials/dynamic-matching.html](https://router.vuejs.org/zh/guide/essentials/dynamic-matching.html)
* Nuxt.js 动态路由
  * [https://zh.nuxtjs.org/docs/2.x/features/file-system-routing#dynamic-routes](https://zh.nuxtjs.org/docs/2.x/features/file-system-routing#dynamic-routes)

在 Nuxt.js 里面定义带参数的动态路由，需要创建对应的以 **<font color="#f00">下划线作为前缀</font>** 的 Vue 文件  或  目录。 

* 以下目录结构： 

  ```markdown
  pages/ 
  --| _slug/ 
  -----| comments.vue 
  -----| index.vue 
  --| users/ 
  -----| _id.vue 
  --| index.vue 
  ```

  目录结果，如图所示：

  ![image-20210107145923345](F:\LaGou\03-module\03-min-module\assets\image-20210107145923345.png)

> 注意：
>
> ​	动态路由的文件是以 `_` 作为前缀的，不可以省略

* Nuxt.js 生成对应的路由配置表为： 

  ```js
  router: { 
      routes: [ 
          { 
              name: 'index', 
              path: '/', 
              component: 'pages/index.vue' 
          }, 
          { 
              name: 'users-id', 
              path: '/users/:id?', 
              component: 'pages/users/_id.vue' 
          }, 
          { 
              name: 'slug', 
              path: '/:slug', 
              component: 'pages/_slug/index.vue'
          }, 
          { 
              name: 'slug-comments', 
              path: '/:slug/comments', 
              component: 'pages/_slug/comments.vue' 
          } 
      ] 
  } 
  ```

  你会发现名称为 `users-id` 的路由路径带有 `:id?` 参数，表示该路由是可选的。如果你想将它设置为必选的路由，需要在 `users/_id` 目录内创建一个 `index.vue` 文件。 

* `pages/users/_id.vue`，代码示例如下：

  ```html
  <div>
      <h1>User Page</h1>
      <p>{{ $route.params.id }}</p>
  </div>
  ```

* 浏览器访问地址为：http://localhost:3000/users/2，其中后面的 2 代表动态路由，可以是任何值，也可以不输入，不输入时，默认访问 `pages/users/index.vue`

  ![image-20210107150242992](F:\LaGou\03-module\03-min-module\assets\image-20210107150242992.png)

#### 嵌套路由 

* Vue Router  嵌套路由
  * [https://router.vuejs.org/zh/guide/essentials/nested-routes.html](https://router.vuejs.org/zh/guide/essentials/nested-routes.html)
* Nuxt.js 嵌套路由
  * [https://zh.nuxtjs.org/docs/2.x/features/file-system-routing#nested-routes](https://zh.nuxtjs.org/docs/2.x/features/file-system-routing#nested-routes)

你可以通过 `vue-router` 的子路由创建 `Nuxt.js` 应用的嵌套路由。 

创建内嵌子路由，你需要添加一个 Vue 文件，同时添加一个与该文件同名的目录用来存放子视图组件。 

> Warning:  别忘了在父组件( **.vue**文件) 内增加   **<nuxt-child/>** 用于显示子视图内容。 

* 假设文件目录结构，如图所示： 

  ```markdown
  pages/ 
  --| users/ 
  -----| _id.vue 
  -----| index.vue 
  --| users.vue 
  ```

  目录结构，如图所示：

  ![image-20210107151111529](F:\LaGou\03-module\03-min-module\assets\image-20210107151111529.png)

* Nuxt.js 自动生成的路由配置如下： 

  ```js
  router: { 
      routes: [ 
          { 
              path: '/users', 
              component: 'pages/users.vue', 
              children: [ 
                  { 
                      path: '', 
                      component: 'pages/users/index.vue', name: 'users' 
                  }, 
                  { 
                      path: ':id', 
                      component: 'pages/users/_id.vue', name: 'users-id' 
                  } 
              ] 
          } 
      ] 
  } 
  ```

* `pages/users.vue`中，书写子路由出口，代码示例如下：

  ```html
  <!-- 子路由出口 -->
  <nuxt-child />
  ```

* 浏览器访问地址：http://localhost:3000/users，默认访问 `pages/users/index.vue`

  ![image-20210107151256057](F:\LaGou\03-module\03-min-module\assets\image-20210107151256057.png)

#### 路由配置 

* 参考文档：[https://zh.nuxtjs.org/docs/2.x/configuration-glossary/configuration-router/](https://zh.nuxtjs.org/docs/2.x/configuration-glossary/configuration-router/)
* 在项目根目录下，新建 `nuxt.config.js` 文件，它是 Nuxt.js 的配置文件。
* <font color="#f00">注意</font>：修改配置文件的内容以后，需要重新启动项目

**base**

应用程序的基URL。例如，如果整个单页应用程序在`/app/`，则base应使用该值`'/app/'` .

* 在 `nuxt.config.js` 文件中进行配置，代码示例如下：

  ```js
   module.exports = {
       router: {
          base: '/app'
       }
   }
  ```

* 重启项目成功后，会给出以下提示：

  ![image-20210107153054301](F:\LaGou\03-module\03-min-module\assets\image-20210107153054301.png)

* `base`设置后，Nuxt.js 也将添加到文档头中`<base href="{{ router.base }}"/>` .

  ![image-20210107153215638](F:\LaGou\03-module\03-min-module\assets\image-20210107153215638.png)

**extendRoutes**

扩展Nuxt.js创建的路由。

* `nuxt.config.js`

  ```js
  module.exports = {
      router: {
          // routes: 一个数组，路由配置表
          // resolve：解析路由组件路径
          extendRoutes(routes, resolve) { // 自定义路由表
              routes.push({
                  name: '/hello',
                  path: 'hello',
                  component: resolve(__dirname, 'pages/user/about.vue')
              })
          }
      }
  }
  ```

* 如果要对路线进行排序，可以使用`sortRoutes(routes)` 函数:

  ```js
  import { sortRoutes } from '@nuxt/utils'
  module.exports = {
      router: {
          extendRoutes(routes, resolve) {
              // Add some routes here ...
  
              // and then sort them
              sortRoutes(routes)
          }
      }
  }
  ```

* 添加使用命名视图的管线时，不要忘记添加相应的`chunkNames`已命名的`组件` .

  ```js
  module.exports = {
      router: {
          extendRoutes(routes, resolve) {
              routes.push({
                  path: '/users/:id',
                  components: {
                      default: resolve(__dirname, 'pages/users'), // or routes[index].component
                      modal: resolve(__dirname, 'components/modal.vue')
                  },
                  chunkNames: {
                      modal: 'components/modal'
                  }
              })
          }
      }
  }
  ```

#### 视  图 

![image-20210107154157966](F:\LaGou\03-module\03-min-module\assets\image-20210107154157966.png)

* 参考文档：[https://zh.nuxtjs.org/docs/2.x/concepts/views/](https://zh.nuxtjs.org/docs/2.x/concepts/views/)

**模板** 

<hr />

app模板用于为Nuxt.js应用程序创建文档的实际HTML框架，该应用程序为头部和主体注入内容以及变量。此文件是自动为您创建的，通常很少需要修改。通过创建一个`app.html`项目的源目录中的文件，默认情况下是根目录。

* Nuxt.js使用的默认模板是：app.html

  ```html
  <!DOCTYPE html>
  <html {{ HTML_ATTRS }}>
      <head {{ HEAD_ATTRS }}>
          {{ HEAD }}
      </head>
      <body {{ BODY_ATTRS }}>
          <!-- 渲染的内容最终会注入到这里 -->
          {{ APP }}
      </body>
  </html>
  ```

* 使用自定义应用程序模板的一个用例是为IE添加条件CSS类：

  ```html
  <!DOCTYPE html>
  <!--[if IE 9]><html class="lt-ie9 ie9" {{ HTML_ATTRS }}><![endif]-->
  <!--[if (gt IE 9)|!(IE)]><!--><html {{ HTML_ATTRS }}><!--<![endif]-->
    <head {{ HEAD_ATTRS }}>
      {{ HEAD }}
    </head>
    <body {{ BODY_ATTRS }}>
      {{ APP }}
    </body>
  </html>
  ```

> 而您可以在`app.html`，建议使用`nuxt.config.js`来完成这些任务！

**布局 Layout**

<hr />

当你想改变你的Nuxt.js应用程序的外观时，布局是一个很好的帮助。例如，您希望包含一个侧边栏或具有不同的移动和桌面布局。

**默认布局** 

可以通过 添加 `layouts/default.vue` 文件。这将用于所有未指定布局的页面。您只需要在布局中包含`<Nuxt />`呈现页面组件的组件

* layouts/default.vue

  ```html
  <template>
      <!-- 页面出口，类似子路由出口 -->
      <Nuxt />
  </template>
  ```

**自定义布局**

可以通过添加`.vue`文件到 `layouts` 目录。为了使用自定义布局，您需要设置 `布局` 属性，该属性位于要使用该布局的页面组件中。该值将是您创建的自定义布局的名称。

* 要创建博客布局，请添加`blog.vue`文件到布局目录`布局/blog.vue` :

  ```html
  <template>
      <div>
          <div>My blog navigation bar here</div>
          <Nuxt />
      </div>
  </template>
  ```

> 当创建一个实际包含页面组件的布局时，要确保添加 **<Nuxt/>** 。

* 然后，我们在希望使用布局的页面中使用值为**“blog”** 的 `layout` 属性。

  ```html
  <template>
      <!-- Your template -->
  </template>
  <script>
      export default {
          layout: 'blog'
          // page component definitions
      }
  </script>
  ```

  > 如果不在页面中添加布局属性，例如。`layout: 'blog'`，然后默认值 `.vue` 将使用布局

**错误页面** 

错误页是*页面组件*它总是在发生错误时显示（服务器端呈现时不会发生这种情况）。

> 虽然此文件位于`layouts`文件夹，但它应该被视为一个页面。

如上所述，这个布局是特殊的，不应该包括 `<Nuxt/>` 组件在其模板中。必须将此布局视为发生错误时显示的组件( ` four hundred and four`  ， `500` 等等）。与其他页面组件类似，也可以按常规方式为错误页设置自定义布局。

* 通过添加 `layouts/error.vue` 文件：

  ```html
  <template>
      <div>
          <h1 v-if="error.statusCode === 404">Page not found</h1>
          <h1 v-else>An error occurred</h1>
          <NuxtLink to="/">Home page</NuxtLink>
      </div>
  </template>
  
  <script>
      export default {
          props: ['error'],
          layout: 'error' // you can set a custom layout for the error page
      }
  </script>
  ```

**异步数据  -- asyncData 方法**

Nuxt.js 扩展了 Vue.js，增加了一个叫* asyncData *的方法，使得我们可以在设置组件的数据之前能 异步获取或处理数据。 

*  [https://zh.nuxtjs.org/docs/2.x/features/data-fetching/#async-data](https://zh.nuxtjs.org/docs/2.x/features/data-fetching/#async-data)

* 基本用法

  * `pages/index.vue`

  ```html
  <template>
      <div id="app">
          <h1>{{ title }}</h1>
          <nuxt-link to="about">About</nuxt-link>
      </div>
  </template>
  
  <script>
      import axios from 'axios'
      export default {
          name: 'HomePage',
          // 当你想要动态页面内容，有利于 SEO 或者是 提升首屏渲染速度的时候，就在 asyncData 中发请求获取数据
          async asyncData () {
              console.log('asyncData');
              console.log(this); // undefined
              // 首屏渲染
              const res = await axios({
                  method: 'GET',
                  url: 'http://localhost:3000/data.json'
              })
              return res.data
          },
          // 如果是非异步数据或者普通数据，则正常的初始化到 data 中即可
          data () {
              return {
                  foo: 'bar'
              }
          }
      }
  </script>
  ```
  
  * 它会将 `asyncData` 返回的数据融合组件 `data` 方法返回数据一并给组件
  
  ![image-20210107172003133](F:\LaGou\03-module\03-min-module\assets\image-20210107172003133.png)
  
  * 调用时机：服务端渲染期间和客户端路由更新之前
  
* 注意事项：

  * 1，只能在页面组件中使用，非页面组件（子组件...）中使用会报错

    * `components/foo.vue`

    ```html
    <template>
      <div>
          <h1>FooPage</h1>
          <p>{{ foo }}</p>
      </div>
    </template>
    
    <script>
    export default {
        name: 'FooPage',
        async asyncData () {
        	return {
                 foo: 'bar'
        	}
        }
    }
    </script>
    ```

    * `pages/index.vue`	

    ```html
    <template>
        <div id="app">
          <foo />
        </div>
    </template>
    
    <script>
        import Foo from '@/components/Foo'
        export default {
            name: 'HomePage',
            components: {
            	Foo
            }
        }
    </script>
    ```

    * 此时，会报出如下错误：

    ![image-20210107172948483](F:\LaGou\03-module\03-min-module\assets\image-20210107172948483.png)

    * **解决方式**，利用父组件向子组件传递数据的方式：

      * `components/foo.vue`

      ```js
      export default {
          name: 'FooPage',
          props: ["posts"]
          // async asyncData () {
          //     return {
          //         foo: 'bar'
          //     }
          // }
      }
      ```

      * `pages/index.vue`	

      ```html
      <foo :posts="posts" />
      ```

  * 没有 `this`，因为它是在组件初始化之前被调用的

  **上下文对象 **

  * [https://zh.nuxtjs.org/docs/2.x/internals-glossary/context/](https://zh.nuxtjs.org/docs/2.x/internals-glossary/context/)

  这个`context`提供从 Nuxt 到 Vue 组件的其他对象/参数，并可用于特殊的Nuxt生命周期区域，如[`asyncData`](https://zh.nuxtjs.org/docs/2.x/features/data-fetching#async-data) ,[`fetch`](https://zh.nuxtjs.org/docs/2.x/features/data-fetching) ,[`plugins`](https://zh.nuxtjs.org/docs/2.x/directory-structure/plugins) ,[`middleware`](https://zh.nuxtjs.org/docs/2.x/directory-structure/middleware#router-middleware)和[`nuxtServerInit`](https://zh.nuxtjs.org/docs/2.x/directory-structure/store#the-nuxtserverinit-action) .

> *这里指的是“我们不要混淆上下文”`context`对象在中可用[`Vuex Actions`](https://vuex.vuejs.org/guide/actions.html). 这两者毫无关联*

* `cintext` 上下文对象，包含内容，如下所示：

  ```js
  function (context) {
      // Universal keys
      const {
          app,
          store,
          route,
          params,
          query,
          env,
          isDev,
          isHMR,
          redirect,
          error,
          $config
      } = context
      // Server-side
      if (process.server) {
          const { req, res, beforeNuxtRender } = context
      }
      // Client-side
      if (process.client) {
          const { from, nuxtState } = context
      }
  }
  ```