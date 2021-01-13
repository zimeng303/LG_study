@[TOC](NuxtJs 综合案例)

# Nuxt.js 综合案例 

## 基本介绍 

* 案例名称：RealWorld
* 一个开源的学习项目，目的就是帮助开发者快速学习新技能
* GitHub仓库：[https://github.com/gothinkster/realworld](https://github.com/gothinkster/realworld) 
* 在线示例：[https://demo.realworld.io/#/](https://demo.realworld.io/#/)
* 接口文档：[https://github.com/gothinkster/realworld/tree/master/api](https://github.com/gothinkster/realworld/tree/master/api)
* 页面模板：[https://github.com/gothinkster/realworld-starter-kit/blob/master/FRONTEND_INSTRUCTIONS.md](https://github.com/gothinkster/realworld-starter-kit/blob/master/FRONTEND_INSTRUCTIONS.md) 

## 学习前提

* Vue.js 使用经验
* Nuxt.js 基础
* Node.js、webpack 相关使用经验

## 学习收获

* 掌握使用 Nuxt.js 开发同构渲染应用
* 增强 Vue.js 实践能力
* 掌握同构渲染应用中常见的功能处理
  * 用户状态管理
  * 页面访问权限处理
  * SEO 优化
  * ...
* 掌握同构渲染应用的发布与部署

## 项目初始化

### 创建项目 

* 准备工作

  ```powershell
  # 创建项目目录 
  mkdir realworld-nuxtjs 
  # 进入项目目录 
  cd realworld-nuxtjs 
  # 生成    package.json 文件 
  npm init -y 
  # 安装    nuxt 依赖 
  npm install nuxt 
  ```

* 在 `package.json` 中添加启动脚本： 

  ```json
  {
     "scripts": { 
         "dev": "nuxt" 
  	}  
  }
  ```

* 创建 `pages/index.vue` ： 

  ```html
  <template> 
      <div> 
          <h1>Home Page</h1> 
      </div> 
  </template> 
  <script> 
      export default { 
          name: 'HomePage' 
      } 
  </script> 
  <style> 
  </style> 
  ```

* 启动服务：

  ```powershell
  npm run dev
  ```

  在浏览器中访问  http://localhost:3000/ 测试。 

### 导入样式资源 

* 配置模板文件，`app.html`： 

  ```html
  <!DOCTYPE html>
  <html {{ HTML_ATTRS }}>
      <head {{ HEAD_ATTRS }}>
          {{ HEAD }}
          <!-- Import Ionicon icons & Google Fonts our Bootstrap theme relies on -->
          <link href="//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" rel="stylesheet" type="text/css">
          <link href="//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic" rel="stylesheet" type="text/css">
          <!-- Import the custom Bootstrap 4 theme from our hosted CDN -->
          <link rel="stylesheet" href="//demo.productionready.io/main.css">
      </head>
      <body {{ BODY_ATTRS }}>
          {{ APP }}
      </body>
  </html>
  ```
  
  由于上述使用的资源文件需要访问国外地址，加载速度缓慢，因此将其 “ 本土化 ”，如下所示：
  
```html
  <!DOCTYPE html>
  <html {{ HTML_ATTRS }}>
      <head {{ HEAD_ATTRS }}>
          {{ HEAD }}
          <!-- Import Ionicon icons & Google Fonts our Bootstrap theme relies on -->
          <link href="https://cdn.jsdelivr.net/npm/ionicons@2.0.1/css/ionicons.min.css" rel="stylesheet" type="text/css">
          <link href="//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic" rel="stylesheet" type="text/css">
          <!-- Import the custom Bootstrap 4 theme from our hosted CDN -->
          <link rel="stylesheet" href="/main.css">
      </head>
      <body {{ BODY_ATTRS }}>
          {{ APP }}
      </body>
  </html>
```

>`ionicons.min.css` 文件需要依赖其他的字体等文件，因此使用 `jsDelivr` 进行地址转换；
>
>`main.css` 文件不需要依赖其他的文件，因此，直接下载文件即可

* 静态资源文件存放在 根目录的 `static` 文件夹下

  ![image-20210111134413852](F:\LaGou\03-module\03-min-module\assets\image-20210111134413852.png)

### 配置布局组件 

将公共部分提取成公共组件。

* `pages/layout/index.vue`

  ```html
  <template>
      <div>
          <!-- 顶部导航栏 -->
          <nav class="navbar navbar-light">
              <div class="container">
                  <a class="navbar-brand" href="index.html">conduit</a>
                  <ul class="nav navbar-nav pull-xs-right">
                      <li class="nav-item">
                          <!-- Add "active" class when you're on that page" -->
                          <a class="nav-link active" href="">Home</a>
                      </li>
                      <li class="nav-item">
                          <a class="nav-link" href="">
                              <i class="ion-compose"></i>&nbsp;New Post
                          </a>
                      </li>
                      <li class="nav-item">
                          <a class="nav-link" href="">
                              <i class="ion-gear-a"></i>&nbsp;Settings
                          </a>
                      </li>
                      <li class="nav-item">
                          <a class="nav-link" href="">Sign up</a>
                      </li>
                  </ul>
              </div>
          </nav>
          <!-- /顶部导航栏 -->
  
          <!-- 子路由 -->
          <nuxt-child />
          <!-- /子路由 -->
  
          <!-- 底部 -->
          <footer>
              <div class="container">
                  <a href="/" class="logo-font">conduit</a>
                  <span class="attribution">
                      An interactive learning project from
                      <a href="https://thinkster.io">Thinkster</a>. Code &amp; design
                      licensed under MIT.
                  </span>
              </div>
          </footer>
          <!-- /底部 -->
      </div>
  </template>
  ```

### 导入登录注册 
* `pages/login/index.vue`

  ```html
  <template>
      <div class="auth-page">
          <div class="container page">
              <div class="row">
                  <div class="col-md-6 offset-md-3 col-xs-12">
                      <h1 class="text-xs-center">{{ isLogin ? "Sign in" : "Sign up" }}</h1>
                      <p class="text-xs-center">
                          <nuxt-link to="/register" v-if="isLogin"
                                     >Need an account?</nuxt-link
                              >
                          <nuxt-link to="/login" v-else>Have an account?</nuxt-link>
                      </p>
  
                      <ul class="error-messages">
                          <li>That email is already taken</li>
                      </ul>
  
                      <form>
                          <fieldset v-if="!isLogin" class="form-group">
                              <input
                                     class="form-control form-control-lg"
                                     type="text"
                                     placeholder="Your Name"
                                     />
                          </fieldset>
                          <fieldset class="form-group">
                              <input
                                     class="form-control form-control-lg"
                                     type="text"
                                     placeholder="Email"
                                     />
                          </fieldset>
                          <fieldset class="form-group">
                              <input
                                     class="form-control form-control-lg"
                                     type="password"
                                     placeholder="Password"
                                     />
                          </fieldset>
                          <button class="btn btn-lg btn-primary pull-xs-right">
                              {{ isLogin ? "Sign in" : "Sign up" }}
                          </button>
                      </form>
                  </div>
              </div>
          </div>
      </div>
  </template>
  
  <script>
      export default {
          name: "LoginIndex",
          computed: {
              isLogin() {
                  return this.$route.name === "login";
              }
          }
      };
  </script>
  ```

### 导入剩余页面

| 路径                         | 页面                |
| :--------------------------- | ------------------- |
| /                            | 首页                |
| /login                       | 登录                |
| /register                    | 注册                |
| /settings                    | 用户设置            |
| /editor                      | 发布文章            |
| /editor/:slug                | 编辑文章            |
| /article/:slug               | 文章详情            |
| /profile/:username           | 用户页面            |
| /profile/:username/favorites | 用户页面/喜欢的文章 |

**用户设置页面** 

* `pages/settings/index.vue `

  ```html
  <template>
      <div class="settings-page">
          <div class="container page">
              <div class="row">
  
                  <div class="col-md-6 offset-md-3 col-xs-12">
                      <h1 class="text-xs-center">Your Settings</h1>
  
                      <form>
                          <fieldset>
                              <fieldset class="form-group">
                                  <input class="form-control" type="text" placeholder="URL of profile picture">
                              </fieldset>
                              <fieldset class="form-group">
                                  <input class="form-control form-control-lg" type="text" placeholder="Your Name">
                              </fieldset>
                              <fieldset class="form-group">
                                  <textarea class="form-control form-control-lg" rows="8" placeholder="Short bio about you"></textarea>
                              </fieldset>
                              <fieldset class="form-group">
                                  <input class="form-control form-control-lg" type="text" placeholder="Email">
                              </fieldset>
                              <fieldset class="form-group">
                                  <input class="form-control form-control-lg" type="password" placeholder="Password">
                              </fieldset>
                              <button class="btn btn-lg btn-primary pull-xs-right">
                                  Update Settings
                              </button>
                          </fieldset>
                      </form>
                  </div>
  
              </div>
          </div>
      </div>
  </template>
  ```

**创建 / 编辑文章**

* `pages/editor/index.vue`

  ```html
  <template>
      <div class="editor-page">
          <div class="container page">
              <div class="row">
  
                  <div class="col-md-10 offset-md-1 col-xs-12">
                      <form>
                          <fieldset>
                              <fieldset class="form-group">
                                  <input type="text" class="form-control form-control-lg" placeholder="Article Title">
                              </fieldset>
                              <fieldset class="form-group">
                                  <input type="text" class="form-control" placeholder="What's this article about?">
                              </fieldset>
                              <fieldset class="form-group">
                                  <textarea class="form-control" rows="8" placeholder="Write your article (in markdown)"></textarea>
                              </fieldset>
                              <fieldset class="form-group">
                                  <input type="text" class="form-control" placeholder="Enter tags"><div class="tag-list"></div>
                              </fieldset>
                              <button class="btn btn-lg pull-xs-right btn-primary" type="button">
                                  Publish Article
                              </button>
                          </fieldset>
                      </form>
                  </div>
  
              </div>
          </div>
      </div>
  </template>
  ```

**文章详情页面**

* `pages/article/index.vue`

  ```html
  <template>
      <div class="article-page">
  
          <div class="banner">
              <div class="container">
  
                  <h1>How to build webapps that scale</h1>
  
                  <div class="article-meta">
                      <a href=""><img src="http://i.imgur.com/Qr71crq.jpg" /></a>
                      <div class="info">
                          <a href="" class="author">Eric Simons</a>
                          <span class="date">January 20th</span>
                      </div>
                      <button class="btn btn-sm btn-outline-secondary">
                          <i class="ion-plus-round"></i>
                          &nbsp;
                          Follow Eric Simons <span class="counter">(10)</span>
                      </button>
                      &nbsp;&nbsp;
                      <button class="btn btn-sm btn-outline-primary">
                          <i class="ion-heart"></i>
                          &nbsp;
                          Favorite Post <span class="counter">(29)</span>
                      </button>
                  </div>
  
              </div>
          </div>
  
          <div class="container page">
  
              <div class="row article-content">
                  <div class="col-md-12">
                      <p>
                          Web development technologies have evolved at an incredible clip over the past few years.
                      </p>
                      <h2 id="introducing-ionic">Introducing RealWorld.</h2>
                      <p>It's a great solution for learning how other frameworks work.</p>
                  </div>
              </div>
  
              <hr />
  
              <div class="article-actions">
                  <div class="article-meta">
                      <a href="profile.html"><img src="http://i.imgur.com/Qr71crq.jpg" /></a>
                      <div class="info">
                          <a href="" class="author">Eric Simons</a>
                          <span class="date">January 20th</span>
                      </div>
  
                      <button class="btn btn-sm btn-outline-secondary">
                          <i class="ion-plus-round"></i>
                          &nbsp;
                          Follow Eric Simons <span class="counter">(10)</span>
                      </button>
                      &nbsp;
                      <button class="btn btn-sm btn-outline-primary">
                          <i class="ion-heart"></i>
                          &nbsp;
                          Favorite Post <span class="counter">(29)</span>
                      </button>
                  </div>
              </div>
  
              <div class="row">
  
                  <div class="col-xs-12 col-md-8 offset-md-2">
  
                      <form class="card comment-form">
                          <div class="card-block">
                              <textarea class="form-control" placeholder="Write a comment..." rows="3"></textarea>
                          </div>
                          <div class="card-footer">
                              <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
                              <button class="btn btn-sm btn-primary">
                                  Post Comment
                              </button>
                          </div>
                      </form>
  
                      <div class="card">
                          <div class="card-block">
                              <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                          </div>
                          <div class="card-footer">
                              <a href="" class="comment-author">
                                  <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
                              </a>
                              &nbsp;
                              <a href="" class="comment-author">Jacob Schmidt</a>
                              <span class="date-posted">Dec 29th</span>
                          </div>
                      </div>
  
                      <div class="card">
                          <div class="card-block">
                              <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                          </div>
                          <div class="card-footer">
                              <a href="" class="comment-author">
                                  <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
                              </a>
                              &nbsp;
                              <a href="" class="comment-author">Jacob Schmidt</a>
                              <span class="date-posted">Dec 29th</span>
                              <span class="mod-options">
                                  <i class="ion-edit"></i>
                                  <i class="ion-trash-a"></i>
                              </span>
                          </div>
                      </div>
  
                  </div>
  
              </div>
  
          </div>
  
      </div>
  </template>
  ```

**导入用户页面**

* `pages/profile/index.vue`

  ```html
  <template>
      <div class="profile-page">
          <div class="user-info">
              <div class="container">
                  <div class="row">
                      <div class="col-xs-12 col-md-10 offset-md-1">
                          <img src="http://i.imgur.com/Qr71crq.jpg" class="user-img" />
                          <h4>Eric Simons</h4>
                          <p>
                              Cofounder @GoThinkster, lived in Aol's HQ for a few months, kinda
                              looks like Peeta from the Hunger Games
                          </p>
                          <button class="btn btn-sm btn-outline-secondary action-btn">
                              <i class="ion-plus-round"></i>
                              &nbsp; Follow Eric Simons
                          </button>
                      </div>
                  </div>
              </div>
          </div>
  
          <div class="container">
              <div class="row">
                  <div class="col-xs-12 col-md-10 offset-md-1">
                      <div class="articles-toggle">
                          <ul class="nav nav-pills outline-active">
                              <li class="nav-item">
                                  <a class="nav-link active" href="">My Articles</a>
                              </li>
                              <li class="nav-item">
                                  <a class="nav-link" href="">Favorited Articles</a>
                              </li>
                          </ul>
                      </div>
  
                      <div class="article-preview">
                          <div class="article-meta">
                              <a href=""><img src="http://i.imgur.com/Qr71crq.jpg" /></a>
                              <div class="info">
                                  <a href="" class="author">Eric Simons</a>
                                  <span class="date">January 20th</span>
                              </div>
                              <button class="btn btn-outline-primary btn-sm pull-xs-right">
                                  <i class="ion-heart"></i> 29
                              </button>
                          </div>
                          <a href="" class="preview-link">
                              <h1>How to build webapps that scale</h1>
                              <p>This is the description for the post.</p>
                              <span>Read more...</span>
                          </a>
                      </div>
  
                      <div class="article-preview">
                          <div class="article-meta">
                              <a href=""><img src="http://i.imgur.com/N4VcUeJ.jpg" /></a>
                              <div class="info">
                                  <a href="" class="author">Albert Pai</a>
                                  <span class="date">January 20th</span>
                              </div>
                              <button class="btn btn-outline-primary btn-sm pull-xs-right">
                                  <i class="ion-heart"></i> 32
                              </button>
                          </div>
                          <a href="" class="preview-link">
                              <h1>
                                  The song you won't ever stop singing. No matter how hard you
                                  try.
                              </h1>
                              <p>This is the description for the post.</p>
                              <span>Read more...</span>
                              <ul class="tag-list">
                                  <li class="tag-default tag-pill tag-outline">Music</li>
                                  <li class="tag-default tag-pill tag-outline">Song</li>
                              </ul>
                          </a>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </template>
  ```

### 手动配置路由

* `nuxt.config.js`

  ```js
  module.exports = {
      router: {
          // 自定义路由表规则
          extendRoutes(routes, resolve) {
              console.log(routes);
              // 清空 Nuxt.js 基于 pages 目录默认生成的路由规则
              routes.splice(0)
  
              // 添加路由规则
              routes.push(...[
                  {
                      path: '/',
                      component: resolve(__dirname, 'pages/layout/'),
                      children: [
                          {
                              path: '', // 默认子路由
                              name: 'home',
                              component: resolve(__dirname, 'pages/home/')
                          },
                          {
                              path: '/login', // 登录子路由
                              name: 'login',
                              component: resolve(__dirname, 'pages/login/')
                          },
                          {
                              path: '/register', // 注册子路由
                              name: 'register',
                              component: resolve(__dirname, 'pages/login/')
                          },
                          {
                              path: '/profile/:username', // 用户子路由
                              name: 'profile',
                              component: resolve(__dirname, 'pages/profile/')
                          },
                          {
                              path: '/settings', // 设置子路由
                              name: 'settings',
                              component: resolve(__dirname, 'pages/settings/')
                          },
                          {
                              path: '/editor', // 创建/编辑文章子路由
                              name: 'editor',
                              component: resolve(__dirname, 'pages/editor/')
                          },
                          {
                              path: '/article/:slug', // 文章详情子路由
                              name: 'article',
                              component: resolve(__dirname, 'pages/article/')
                          }
                      ]
                  }
              ])
          }
      }
  }
  ```

### 处理顶部导航链接 

* `pages/layout/index.vue`，将所有 `a标签` 改写为 `nuxt-link 标签`

  ```html
  <template>
      <div>
          <!-- 顶部导航栏 -->
          <nav class="navbar navbar-light">
              <div class="container">
                  <!-- <a class="navbar-brand" href="index.html">conduit</a> -->
  
                  <nuxt-link
                             class="navbar-brand"
                             to="/"
                             >Home</nuxt-link>
                  <ul class="nav navbar-nav pull-xs-right">
                      <li class="nav-item">
                          <!-- Add "active" class when you're on that page" -->
                          <!-- exact 设置精确匹配时，才会高亮 -->
                          <nuxt-link class="nav-link active" to="/" exact>Home</nuxt-link>
                      </li>
                      <li class="nav-item">
                          <nuxt-link class="nav-link" to="/editor">
                              <i class="ion-compose"></i>&nbsp;New Post
                          </nuxt-link>
                      </li>
                      <li class="nav-item">
                          <nuxt-link class="nav-link" to="/settings">
                              <i class="ion-gear-a"></i>&nbsp;Settings
                          </nuxt-link>
                      </li>
                      <li class="nav-item">
                          <nuxt-link class="nav-link" to="/login">Sign in</nuxt-link>
                      </li>
                      <li class="nav-item">
                          <nuxt-link class="nav-link" to="/register">Sign up</nuxt-link>
                      </li>
                      <li class="nav-item">
                          <nuxt-link class="nav-link" to="/profile/123">
                              <img
                                   class="user-pic"
                                   src="http://toutiao.meiduo.site/FtNcS8sKFSYQbtBbd40eFTL6lAs_"
                                   />
                              lpz999
                          </nuxt-link>
                      </li>
                  </ul>
              </div>
          </nav>
          <!-- /顶部导航栏 -->
  
          <!-- 子路由 -->
          <nuxt-child />
          <!-- /子路由 -->
  
          <!-- 底部 -->
          <footer>
              <div class="container">
                  <a href="/" class="logo-font">conduit</a>
                  <span class="attribution">
                      An interactive learning project from
                      <a href="https://thinkster.io">Thinkster</a>. Code &amp; design
                      licensed under MIT.
                  </span>
              </div>
          </footer>
          <!-- /底部 -->
      </div>
  </template>
  ```

### 处理导航链接高亮

* `nuxt.config.js`，配置路由链接高亮

  ```js
  module.exports = {
      router: {
          // 处理导航链接高亮
          linkActiveClass: 'active',
          .....
      }
  }
  ```

### 封装请求模块

* 安装 axios：

  ```powershell
  npm i axios --save
  ```

* 创建 `utils/request.js ` 文件，封装请求模块

  ```js
  /**
   * 基于 axios 封装的请求模块
   */
  import axios from 'axios'
  
  // 使用自定义配置新建一个 axios 实例
  const request = axios.create({
      // 配置基本的请求路径
      baseURL: 'https://conduit.productionready.io'
  })
  
  export default request
  ```

## 登录注册

### 封装请求方法 

* 创建 `api/user.js` 文件，封装**`登录注册`**相关的请求方法

  ```js
  import request from '@/utils/request' 
  
  // 用户登录
  export const login = data => {
      return request({
          method: "POST",
          url: "/api/users/login",
          data
      })
  } 
  
  // 用户注册
  export const register = data => {
      return request({
          method: "POST",
          url: "/api/users",
          data
      })
  } 
  ```

### 基本用户登录注册

**实现基本登录功能**

**表单验证** 

**错误处理** 

**用户注册** 

* `pages/login/index.vue`，调用接口，输入登录信息，完成基本登录注册功能

  ```html
  <template>
    <div class="auth-page">
      <div class="container page">
        <div class="row">
          <div class="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">{{ isLogin ? "Sign in" : "Sign up" }}</h1>
            <p class="text-xs-center">
              <nuxt-link to="/register" v-if="isLogin"
                >Need an account?</nuxt-link
              >
              <nuxt-link to="/login" v-else>Have an account?</nuxt-link>
            </p>
  
            <!-- 错误处理 -->
            <ul class="error-messages">
              <template v-for="(messages, field) in errors">
                <li v-for="(message, index) in messages" :key="index">
                  {{ field }} {{ message }}
                </li>
              </template>
            </ul>
  
            <form @submit.prevent="onSubmit">
              <fieldset v-if="!isLogin" class="form-group">
                <input
                  v-model="user.username"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.email"
                  class="form-control form-control-lg"
                  type="email"
                  placeholder="Email"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.password"
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  required
                  minlength="8"
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                {{ isLogin ? "Sign in" : "Sign up" }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { login, register } from "@/api/user";
  
  export default {
    name: "LoginIndex",
    computed: {
      isLogin() {
        return this.$route.name === "login";
      },
    },
    data() {
      return {
        user: {
          username: "",
          email: "",
          password: "",
        },
        errors: {}, // 错误信息
      };
    },
    methods: {
      async onSubmit() {
        // 通过 try {} catch () {} 捕获错误信息
        try {
          // 提交表单请求登录
          const { data } = this.isLogin ? await login({
            user: this.user,
          }) : await register({
            user: this.user,
          })
  
          // 跳转到首页
          this.$router.push("/");
        } catch (err) {
          // console.log("请求失败", err);
          this.errors = err.response.data.errors;
        }
      }
    }
  };
  </script>
  ```

### 存储用户登录状态 

**存储原因**

****

* 需要根据登录状态判断页面的显示内容；
* 某些页面只有登录后，才可以访问；
* ......

**解析存储登录状态实现流程**

****

* 官网地址：[https://zh.nuxtjs.org/faq/auth-external-jwt/#login-page](https://zh.nuxtjs.org/faq/auth-external-jwt/#login-page)

* 官网示例，代码如下：

  * `login.vue`

  ```js
  // js-cookie 专门用来操作客户端浏览器 cookie 的包，即只有客户端时，才会加载 js-cookie 包
  const Cookie = process.client ? require('js-cookie') : undefined
  
  export default {
      middleware: 'notAuthenticated',
      methods: {
          postLogin() {
              setTimeout(() => {
                  // we simulate the async request with timeout.
                  const auth = {
                      accessToken: 'someStringGotFromApiServiceWithAjax'
                  }
                  // 存储到容器是为了方便共享
                  this.$store.commit('setAuth', auth) // mutating to store for client rendering
                  // 把登录状态存到 Cookie 中，使 客户端和服务端都可以拿到
                  Cookie.set('auth', auth) // saving token in cookie for server rendering
                  this.$router.push('/')
              }, 1000)
          }
      }
  }
  ```

  * `store/index.js`

  ```js
  import Vuex from 'vuex'
  
  const cookieparser = process.server ? require('cookieparser') : undefined
  
  const createStore = () => {
      return new Vuex.Store({
          state: () => ({
              auth: null
          }),
          mutations: {
              setAuth(state, auth) {
                  state.auth = auth
              }
          },
          actions: {
              // 初始化容器以及需要传递给客户端的数据
              // 这个特殊的 action 只会在服务端渲染期间运行
              nuxtServerInit({ commit }, { req }) {
                  let auth = null
                  // 如果请求头中有 Cookie
                  if (req.headers.cookie) {
                      const parsed = cookieparser.parse(req.headers.cookie)
                      try {
                          auth = JSON.parse(parsed.auth)
                      } catch (err) {
                          // No valid cookie found
                      }
                  }
                  // 提交 mutation，修改 state 状态
                  commit('setAuth', auth)
              }
          }
      })
  }
  
  export default createStore
  ```

> <font color="#f00">注意：</font>
>
> ​	该`nuxtServerInit`函数只在每个服务器端呈现中运行。所以我们用它来改变存储中的会话浏览器cookie。我们可以使用`req.headers.cookie`并使用`cookieparser`*.*

**存储登录状态，并将其持久化**

****

1. **初始化容器数据**

   * `store/index.js`

   ```js
   // 在服务端渲染期间运行都是同一个实例
   // 为了防止数据冲突，务必要把 state 定义成一个函数，返回数据对象
   export const state = () => {
       return {
           // 当前登录用户的登录状态
           user: null
       }
   }
   
   export const mutations = {
       setUser(state, data) {
           state.user = data
       }
   }
   
   export const actions = {}
   ```

> <font color="#f00">注意：</font>
>
> ​	1，`Nuxt.js` 中已经集成了 `Vuex`，无需手动载入；
>
> ​	2，`store` 目录的名称是 <font color="#f00">固定的，不可修改的</font>；
>
> ​	3，Nuxt.js 在运行过程中，查找到 `store` 目录，会自动加载`store` 目录中的容器模块。

2. **登录成功，将用户信息存入容器** 

   * `pages/login/index.vue`

   ```js
   // TODO：保存用户的登录状态
   this.$store.commit('setUser', data.user)
   ```

3. **将登录状态持久化到 `Cookie` 中 ** 

   * 启动 `cmd`命令行，安装 `js-cookie`

   ```powershell
   npm i js-cookie --save
   ```

   * 在 `store/index.js` 中，按需加载 `js-cookie`，即只在 **客户端** 中使用

   ```js
   const Cookie = process.client ? require('js-cookie') : undefined 
   ```

   * 在 `pages/login/index.vue` 中，将登录状态存储到 Cookie 中

   ```js
   // 为了防止刷新页面数据丢失，我们需要把数据持久化
   Cookie.set('user', data.user)
   ```

4. **从 `Cookie` 中获取并初始化用户登录状态** 

   * 安装 `cookieparser`

   ```powershell
   npm i cookieparser --save
   ```

   * 在 `store/index.js` 中，定义 `nuxtServerInit` 函数，初始化容器数据，传递数据给客户端使用

   ```js
   export const actions = {
       // nuxtServerInit 是一个特殊的 action
       // 这个 action 会在服务端渲染期间自动调用
       // 作用：初始化容器数据，传递数据给客户端使用
       nuxtServerInit({ commit }, { req }) {
           let user = null
           // 如果请求头中有 Cookie
           if (req.headers.cookie) {
               // 使用 cookieparser 把 cookie 字符串转换为 JavaScript 对象
               const parsed = cookieparser.parse(req.headers.cookie)
               try {
                   user = JSON.parse(parsed.user)
               } catch (err) {
                   // No valid cookie found
               }
           }
           // 提交 mutation，修改 state 状态
           commit('setUser', user)
       }
   }
   ```

**处理页面访问权限**

****

1. **中间件简介**

   1，**官网地址**：[https://zh.nuxtjs.org/docs/2.x/directory-structure/middleware#router-middleware](https://zh.nuxtjs.org/docs/2.x/directory-structure/middleware#router-middleware)

   2，**基本概述**

   * 中间件允许定义可以在呈现页面或一组页面（布局）之前运行的自定义函数。
   * 共享中间件应该放在`middleware/`目录。文件名将是中间件的名称(`中间件/auth.js`将会是`auth`中间件），也可以通过直接使用函数来定义特定于页面的中间件，请参阅[匿名中间件](https://zh.nuxtjs.org/docs/2.x/components-glossary/pages-middleware#anonymous-middleware) .
   * 中间件接收 [context](https://zh.nuxtjs.org/docs/2.x/internals-glossary/context) 作为第一个参数。

   ```js
   export default function (context) {
     // Add the userAgent property to the context
     context.userAgent = process.server
       ? context.req.headers['user-agent']
       : navigator.userAgent
   }
   ```

   在通用模式下，`middleware` 将在服务器端（第一次向Nuxt应用程序请求时，例如直接访问应用程序或刷新页面时）调用一次，在导航到其他路由时在客户端调用一次。与`ssr: false`，在这两种情况下都将在客户端调用中间件。

   中间件将按以下顺序串联执行：

   1. `nuxt.config.js`（按文件中的顺序）
   2. 匹配的布局
   3. 匹配的页面

2. **基本分类**

   * **路由器中间件**

     中间件可以是异步的。要执行此操作，返回 `Promise` 或者使用 `async/await`。

     * `中间件/stats.js`

     ```js
     import http from 'http'
     
     export default function ({ route }) {
         return http.post('http://my-stats-api.com', {
             url: route.fullPath
         })
     }
     ```

     那么，在你的`nuxt.config.js`，使用`路由器.中间件`钥匙

     * `nuxt.config.js`

     ```js
     export default {
         router: {
             middleware: 'stats'
         }
     }
     ```

     现在`stats`每次路由更改都将调用中间件。

     您也可以将中间件（甚至多个）添加到特定的布局或页面。

     * `页面/索引视图/布局/默认视图`

     ```js
     export default {
       middleware: ['auth', 'stats']
     }
     ```

   * **命名中间件**

     可以通过在`middleware/`目录中，文件名将是中间件名称。

     * `middleware/authenticated.js`

     ```js
     export default function ({ store, redirect }) {
         // If the user is not authenticated
         if (!store.state.authenticated) {
             return redirect('/login')
         }
     }
     ```

     * `页面/secret.vue`

     ```html
     <template>
         <h1>Secret page</h1>
     </template>
     
     <script>
         export default {
             middleware: 'authenticated'
         }
     </script>
     ```

   * **匿名中间件**

     如果只需要为特定页面使用中间件，可以直接为其使用函数（或函数数组）：

     * `页面/secret.vue`

     ```html
     <template>
         <h1>Secret page</h1>
     </template>
     
     <script>
         export default {
             middleware({ store, redirect }) {
                 // If the user is not authenticated
                 if (!store.state.authenticated) {
                     return redirect('/login')
                 }
             }
         }
     </script>
     ```

2. **页面访问权限实现过程**

   * `middleware/authenticated.js`

   ```js
   /**
    * 验证是否登录的中间件
    */
   export default function ({ store, redirect }) {
       // If the user is not authenticated
       if (!store.state.user) {
           // 重定向，即跳转到 登录页面
           return redirect('/login')
       }
   }
   ```

   * `middlewares/notAuthenticated.js`

   ```js
   /**
    * 如果已登录，重定向至首页
    */
   export default function ({ store, redirect }) {
       // If the user is authenticated redirect to home page
       if (store.state.user) {
           return redirect('/')
       }
   }
   ```

   * 在需要判断登录权限的页面中配置使用中间件

   ```js
   // 在路由匹配组件渲染之前会先执行中间件处理
   // 多个中间件，使用数组
   export default { 
       ... 
       middleware: ['authenticated'] 
   }
   
   // 单个中间件，使用字符串；
   export default { 
       ... 
       middleware: 'authenticated'
   }
   ```

## 首页模块

### 展示公共文章列表 

* 接口文档：[https://github.com/gothinkster/realworld/tree/master/api#list-articles](https://github.com/gothinkster/realworld/tree/master/api#list-articles)

**封装请求方法**

* `api/article.js`

  ```js
  import request from '@/utils/request' 
  
  // 获取公共文章列表
  export const getArticles = params => {
      // params 是可选的
      return request({
          method: 'GET',
          url: '/api/articles',
          params
      }) 
  }
  ```

**获取数据**

* 在 `pages/home/index.vue` 中，请求接口，获取数据

  ```js
  import { getArticles } from "@/api/article";
  
  export default {
      name: "HomePage",
      // 需要 SEO
      async asyncData() {
          const { data } = await getArticles();
          return {
              articles: data.articles,
              articlesCount: data.articlesCount,
          };
      },
  };
  ```

**模板绑定**

* 在 `pages/home/index.vue` 中，循环渲染数据，实现模板动态绑定

  ```html
  <div
       class="article-preview"
       v-for="article in articles"
       :key="article.slug"
       >
      <div class="article-meta">
          <nuxt-link :to="{
               name: 'profile',
               params: {
               	username: article.author.username
               }
          }"
          >
              <img :src="article.author.image"/>
          </nuxt-link>
          <div class="info">
              <nuxt-link 
                 :to="{
                       name: 'profile',
                       params: {
                       	username: article.author.username
                       }
                 }"
                 class="author"
              >{{ article.author.username }}</nuxt-link>
              <span class="date">{{ article.createdAt }}</span>
          </div>
          <button class="btn btn-outline-primary btn-sm pull-xs-right"
                  :class="{ active: article.favorited }"
          >
              <i class="ion-heart"></i> {{ article.favoritesCount }}
          </button>
      </div>
      <nuxt-link 
         :to="{
             name: 'article',
             params: {
                 slug: article.slug
             }
         }" 
         class="preview-link"
      >
          <h1>{{ article.title }}</h1>
          <p>{{ article.description }}</p>
          <span></span>
      </nuxt-link>
  </div>
  ```

### 公共文章列表分页

**处理分页参数 **

* `pages/home/index.vue`，访问接口时，传入每次访问的文章数量 和 数据的偏移量

  ```js
  // 需要 SEO
  async asyncData({ query }) {
      // query 存储所有的查询条件
      const page = Number.parseInt(query.page || 1);
      const limit = 20;
      const { data } = await getArticles({
          limit, // 每页显示的文章数量
          // 数据偏移量
          offset: (page - 1) * limit,
      });
      return {
          limit,
          page,
          articles: data.articles,
          articlesCount: data.articlesCount,
      };
  },
  ```

**页码处理**

* 在 `pages/home/index.vue` 中，书写**分页模板**

  ```html
  
  ```

  * 1，使用计算属性计算总页码 

  ```js
  computed: {
      // 总页码
      totalPage() {
          return Math.ceil(this.articlesCount / this.limit);
      }
  }
  ```

  * 2，遍历生成页码列表

  ```html
  
  <!-- 分页列表 -->
  <nav>
      <ul class="pagination">
          <li
              class="page-item"
              v-for="item in totalPage"
              :key="item"
              :class="{
                   active: item === page,
              }"
              >
              <nuxt-link
                  class="page-link"
                  :to="{
                       name: 'home',
                       query: {
                           page: item,
                       },
                   }"
              >{{ item }}</nuxt-link>
          </li>
      </ul>
  </nav>
  <!-- /分页列表 -->
  ```

  * 3，设置导航链接
  * 4，响应 query 参数的变化 

  ```js
  // 查询参数改变时，不会调用 asyncData 等
  // 通过 watchQuery 解决，类似于热更新
  // 注意，需要刷新整个页面，否则不起作用
  watchQuery: ['page'],
  ```

  > 官网地址：[https://zh.nuxtjs.org/docs/2.x/components-glossary/pages-watchquery/](https://zh.nuxtjs.org/docs/2.x/components-glossary/pages-watchquery/)

### 展示文章标签列表

**封装请求方法**

* `api/tag.js`

  ```js
  import request from '@/utils/request' 
  
  // 获取文章标签列表
  export const getTags = () => {
      // params 是可选的
      return request({
          method: 'GET',
          url: '/api/tags'
      }) 
  }
  ```

**模板绑定**

* `pages/home/index.vue`

  ```html
  <div class="col-md-3">
      <div class="sidebar">
          <p>Popular Tags</p>
  
          <div class="tag-list">
              <nuxt-link
                  :to="{
                       name: 'home',
                        query: {
                            tag: item
                        }
                   }"
                   class="tag-pill tag-default"
                   v-for="item in tags"
                   :key="item"
             >{{ item }}</nuxt-link>
          </div>
      </div>
  </div>
  ```

### 优化并行异步任务

* `pages/home/index.vue`

  ```js
  async asyncData({ query }) {
      // query 存储所有的查询条件
      const page = Number.parseInt(query.page || 1);
      const limit = 20;
      const [articleRes, tagRes] = await Promise.all([
          getArticles({
              limit, // 每页显示的文章数量
              // 数据偏移量
              offset: (page - 1) * limit,
              tag: query.tag
          }),
          getTags(),
      ]);
  
      const { articles, articlesCount} = articleRes.data
      const { tags } = tagRes.data
  
      return {
          articles,
          articlesCount,
          tags,
          limit,
          page
      };
  },
  watchQuery: ["page", "tag"],
  ```

### 处理首页的导航栏

* `pages/home/index.vue`

  ```html
  <template>
      <div class="home-page">
          <div class="banner">
              <div class="container">
                  <h1 class="logo-font">conduit</h1>
                  <p>A place to share your knowledge.</p>
              </div>
          </div>
  
          <div class="container page">
              <div class="row">
                  <div class="col-md-9">
                      <div class="feed-toggle">
                          <ul class="nav nav-pills outline-active">
                              <li v-if="user" class="nav-item">
                                  <!-- <a class="nav-link disabled" href="">Your Feed</a> -->
                                  <nuxt-link
                                       class="nav-link"
                                       :class="{ active: tab === 'your_feed' }"
                                        exact
                                        :to="{
                                            name: 'home',
                                            query: {
                                                tab: 'your_feed',
                                             },
                                          }"
                                 >Your Feed</nuxt-link>
                              </li>
                              <li class="nav-item">
                                  <nuxt-link
                                       class="nav-link"
                                       :class="{ active: tab === 'global_feed' }"
                                       exact
                                       :to="{
                                           name: 'home',
                                           query: {
                                               tab: 'global_feed',
                                           },
                                        }"
                                   >Global Feed</nuxt-link>
                              </li>
                              <li v-if="tag" class="nav-item">
                                  <nuxt-link
                                       class="nav-link"
                                       :class="{ active: tab === 'tag' }"
                                       exact
                                       :to="{
                                           name: 'home',
                                           query: {
                                               tab: 'tag',
                                               tag: tag,
                                           }
                                        }"
                                    >#{{ tag }}</nuxt-link>
                              </li>
                          </ul>
                      </div>
  
                      <div
                           class="article-preview"
                           v-for="article in articles"
                           :key="article.slug"
                           >
                          <div class="article-meta">
                              <nuxt-link
                                   :to="{
                                        name: 'profile',
                                        params: {
                                            username: article.author.username,
                                        }
                                     }"
                               >
                                  <img :src="article.author.image" />
                              </nuxt-link>
                              <div class="info">
                                  <nuxt-link
                                       :to="{
                                           name: 'profile',
                                           params: {
                                               username: article.author.username,
                                           },
                                         }"
                                         class="author"
                                    >{{ article.author.username }}</nuxt-link>
                                  <span class="date">{{ article.createdAt }}</span>
                              </div>
                              <button
                                      class="btn btn-outline-primary btn-sm pull-xs-right"
                                      :class="{ active: article.favorited }"
                                      >
                                  <i class="ion-heart"></i> {{ article.favoritesCount }}
                              </button>
                          </div>
                          <nuxt-link
                               :to="{
                                    name: 'article',
                                    params: {
                                        slug: article.slug,
                                    }
                                 }"
                                 class="preview-link"
                           >
                              <h1>{{ article.title }}</h1>
                              <p>{{ article.description }}</p>
                              <span></span>
                          </nuxt-link>
                      </div>
  
                      <!-- 分页列表 -->
                      <nav>
                          <ul class="pagination">
                              <li
                                  class="page-item"
                                  v-for="item in totalPage"
                                  :key="item"
                                  :class="{ active: item === page }"
                               >
                                  <nuxt-link
                                       class="page-link"
                                       :to="{
                                           name: 'home',
                                           query: {
                                               page: item,
                                               tag: $route.query.tag,
                                               tab: tab,
                                            }
                                         }"
                                    >{{ item }}</nuxt-link>
                              </li>
                          </ul>
                      </nav>
                      <!-- /分页列表 -->
                  </div>
  
                  <div class="col-md-3">
                      <div class="sidebar">
                          <p>Popular Tags</p>
  
                          <div class="tag-list">
                              <nuxt-link
                                   :to="{
                                      name: 'home',
                                      query: {
                                          tab: 'tag',
                                          tag: item,
                                      }
                                    }"
                                    class="tag-pill tag-default"
                                    v-for="item in tags"
                                    :key="item"
                                >{{ item }}</nuxt-link>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </template>
  
  <script>
      import { getArticles, getFeedArticles } from "@/api/article";
      import { getTags } from "@/api/tag";
      import { mapState } from "vuex";
  
      export default {
          name: "HomePage",
          // 需要 SEO
          async asyncData({ query, store }) {
              // query 存储所有的查询条件
              const page = Number.parseInt(query.page || 1);
              const limit = 20;
              const { tag } = query;
              const tab = query.tab || "global_feed";
              // 判断是否是用户关注的文章列表
              const loadArticles =
                    store.state.user && tab === "your_feed" ? getFeedArticles : getArticles;
  
              const [articleRes, tagRes] = await Promise.all([
                  loadArticles({
                      limit, // 每页显示的文章数量
                      // 数据偏移量
                      offset: (page - 1) * limit,
                      tag,
                  }),
                  getTags(),
              ]);
  
              const { articles, articlesCount } = articleRes.data;
              const { tags } = tagRes.data;
  
              return {
                  articles,
                  articlesCount,
                  tags,
                  limit,
                  page,
                  tag,
                  tab,
              };
          },
          // 查询参数改变时，不会调用 asyncData 等
          // 通过 watchQuery 解决，类似于热更新
          // 注意，需要刷新整个页面，否则不起作用
          watchQuery: ["page", "tag", "tab"],
          computed: {
              // 总页码
              totalPage() {
                  return Math.ceil(this.articlesCount / this.limit);
              },
              ...mapState(["user"]),
          },
      };
  </script>
  ```

* `api/article.js`，封装用户关注文章列表的请求方法

  ```js
  // 获取关注的用户文章列表
  export const getFeedArticles = params => {
      // params 是可选的
      return request({
          method: 'GET',
          url: '/api/articles/feed',
          // Authorization: Token jwt.token.here
          headers: {
              Authorization: `Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTM0NjgyLCJ1c2VybmFtZSI6ImFsaXNvbiIsImV4cCI6MTYxNTYxODY0NH0.FE-89YvLHeTYARzN-QX0VRmSlwB4CV9qg56_CytCX2c`
          },
          params
      }) 
  }
  ```

### 统一设置用户 Token

**添加请求拦截器**

* 在整个应用程序中使用函数或值时，使用插件机制在 `plugins/request.js` 中注入 `context`

  ```js
  /**
   * 基于 axios 封装的请求模块
   */
  
  import axios from 'axios'
  
  // 创建请求对象
  export const request = axios.create({
      // 配置基本的请求路径
      baseURL: 'https://conduit.productionready.io'
  })
  
  // 通过插件机制获取到上下文对象（query、params、req、res、app、store...）
  // 将容器 context 注入进来
  // 插件导出函数必须作为 default 成员
  export default ({ store }) => {
      // 请求拦截器
      // Add a request interceptor
      // 任何请求都要经过请求拦截器
      // 我们可以在请求拦截器中做一些公共的业务处理，例如统一设置 Token
      request.interceptors.request.use(function (config) {
          // Do something before request is sent
          // 在发送请求之前做些什么
          // 请求就会经过这里
          const { user } = store.state
  
          if (user && user.token) {
              // Authorization: Token jwt.token.here
              config.headers.Authorization = `Token ${user.token}`
          }
  
          // 返回 config 请求配置对象
          return config;
      }, function (error) {
          // 如果请求失败(此时请求还没有发出去)，就会进入这里
          // Do something with request error
          // 对请求错误做些什么
          return Promise.reject(error);
      });
  }
  ```

**使用插件，注入 context**

* 官网地址：[https://zh.nuxtjs.org/docs/2.x/directory-structure/plugins/](https://zh.nuxtjs.org/docs/2.x/directory-structure/plugins/)

* 在 `nuxt.config.js` 中，注册插件

  ```js
  /**
   * Nuxt.js 的配置文件
   */
  
  module.exports = {
      ......
      // 注册插件
      plugins: [
          '~/plugins/request.js'
      ]
  }
  ```

**<font color="#f00">注意:</font>**

* 将原来 `api/*` 目录中文件引入的 `request` 方法，改为如下代码:

  ```js
  import { request } from '@/plugins/request' 
  ```

### 文章发布时间格式化

* GitHub 地址: [https://github.com/iamkun/dayjs](https://github.com/iamkun/dayjs)

* 使用 `dayjs` 模块，安装 `dayjs`

  ```powershell
  npm i dayjs --save
  ```

* `plugins/dayjs.js`, 封装 `dayjs` 插件

  ```js
  /**
   * 日期格式化 过滤器
   */
  
  import Vue from "vue";
  import dayjs from "dayjs";
  
  // 注册全局过滤器
  // {{ 表达式 | 过滤器 }}
  Vue.filter('date', (value, format = 'YYYY-MM-DD HH:mm:ss') => {
      return dayjs(value).format(format)
  })
  ```

* `nuxt.config.js`, 注册插件

  ```js
  module.exports = {
      ......
      // 注册插件
      plugins: [
          '~/plugins/dayjs.js'
      ]
  }
  ```

* `pages/home/index.vue`, 使用过滤器

  ```html
  <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
  ```

### 对文章进行点赞操作

**封装请求方法**

* `api/article.js`

  ```js
  // 添加点赞
  export const addFavorite = slug => {
      return request({
          method: 'POST',
          url: `/api/articles/${slug}/favorite`
      }) 
  }
  
  // 取消点赞
  export const deleteFavorite = slug => {
      return request({
          method: 'DELETE',
          url: `/api/articles/${slug}/favorite`
      }) 
  }
  ```

**绑定点击事件**

* `pages/home/index.vue`

  ```html
  <button
          class="btn btn-outline-primary btn-sm pull-xs-right"
          :class="{
                  active: article.favorited,
                  }"
          @click="onFavorite(article)"
          :disabled="article.favoriteDisabled"
          >
      <i class="ion-heart"></i> {{ article.favoritesCount }}
  </button>
  ```

  ```js
  async asyncData({ query, store }) {
      ......
      // 防止重复点击
      articles.forEach(article => article.favoriteDisabled = false)
          ......
  },
  methods: {
      async onFavorite (article) {
          article.favoriteDisabled = true
          if (article.favorited) {
              // 取消点赞
              await deleteFavorite(article.slug)
              article.favorited = false
              article.favoritesCount -= 1
          } else {
              // 添加点赞
              await addFavorite(article.slug)
              article.favorited = true
              article.favoritesCount += 1
          }
          article.favoriteDisabled = false
      }
  }
  ```

##  文章详情

### 展示基本信息

**封装请求方法**

* `api/article.js`

  ```js
  // 获取文章详情
  export const getArticle = slug => {
      return request({
          method: 'GET',
          url: `/api/articles/${slug}`
      }) 
  }
  ```

**获取数据*** 

* `pages/article/index.vue`

  ```js
  import { getArticle } from '@/api/article'
  export default {
      name: 'ArticleIndex',
      async asyncData ({ params }) {
          const { data } = await getArticle(params.slug)
          return {
              article: data.article
          }
      }
  }
  ```

**模板页面**

* `pages/article/index.vue`

  ```html
  <template>
      <div class="article-page">
          <div class="banner">
              <div class="container">
                  <h1>{{ article.title }}</h1>
  
                  <article-meta :article="article" />
              </div>
          </div>
  
          <div class="container page">
              <div class="row article-content">
                  <div class="col-md-12" v-html="article.body"></div>
              </div>
  
              <hr />
  
              <div class="article-actions">
                  <article-meta :article="article" />
              </div>
  
              <div class="row">
                  <div class="col-xs-12 col-md-8 offset-md-2">
                      <article-comments :article="article" />
                  </div>
              </div>
          </div>
      </div>
  </template>
  ```

### Markdown 转为 HTML

* GitHub 地址: [https://github.com/markdown-it/markdown-it](https://github.com/markdown-it/markdown-it)

* 使用 `markdown-it` 模块，安装 `markdown-it`

  ```powershell
  npm i markdown-it --save
  ```

* `pages/article/index.vue`, 把 markdown 格式的数据转换成 HTML

  ```js
  import { getArticle } from '@/api/article'
  import MarkdownIt from 'markdown-it'
  
  export default {
      name: 'ArticleIndex',
      async asyncData ({ params }) {
          const { data } = await getArticle(params.slug)
          const { article } = data
          const md = new MarkdownIt()
          // 将 Makedown 格式转换为 HTML
          article.body = md.render(article.body)
          return {
              article
          }
      }
  }
  ```

### 展示文章作者相关信息

* `pages/article/article-meta.vue`. 提取公共组件，渲染文章作者相关信息

  ```html
  <template>
      <div class="article-actions">
          <div class="article-meta">
              <nuxt-link
                         :to="{
                              name: 'profile',
                              params: {
                              username: article.author.username,
                              },
                              }"
                         >
                  <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                  <nuxt-link
                             :to="{
                                  name: 'profile',
                                  params: {
                                  username: article.author.username,
                                  },
                                  }"
                             class="author"
                             >
                      {{ article.author.username }}
                  </nuxt-link>
                  <span class="date">{{ article.createdAt | date("MMM DD, YYYY") }}</span>
              </div>
  
              <button
                      class="btn btn-sm btn-outline-secondary"
                      :class="{
                              active: article.author.following,
                              }"
                      >
                  <i class="ion-plus-round"></i>
                  &nbsp; Follow {{ article.author.username }}
                  <span class="counter">({{ article.favoritesCount }})</span>
              </button>
              &nbsp;
              <button
                      class="btn btn-sm btn-outline-primary"
                      :class="{
                              active: article.favorited,
                              }"
                      >
                  <i class="ion-heart"></i>
                  &nbsp; Favorite Post
                  <span class="counter">({{ article.favoritesCount }})</span>
              </button>
          </div>
      </div>
  </template>
  
  <script>
      export default {
          name: "ArticleMeta",
          props: {
              article: {
                  type: Object,
                  required: true,
              },
          },
      };
  </script>
  ```

* `pages/article/index.vue`，父组件引入子组件

  ```js
  import ArticleMeta from "./components/article-meta";
  import ArticleComments from "./components/article-comments";
  
  export default {
      ......
      components: {
          ArticleMeta,
          ArticleComments
      },
  };
  ```

### 设置页面 meta 优化 SEO

* 官网地址: [https://zh.nuxtjs.org/docs/2.x/components-glossary/pages-head/](https://zh.nuxtjs.org/docs/2.x/components-glossary/pages-head/)

* `pages/article/index.vue`

  ```js
  head() {
      return {
          // 设置页面的 title
          title: `${this.article.title} - RealWorld`,
          meta: [
              // hid is used as unique identifier. Do not use `vmid` for it as it will not work
              {
                  hid: "description",
                  name: "description",
                  content: this.article.description,
              },
          ],
      };
  },
  ```

### 展示评论列表

* `pages/article/article-comments.js`，提取公共组件，通过客户端渲染展示评论列表

  ```html
  <template>
      <div>
          <form class="card comment-form">
              <div class="card-block">
                  <textarea
                            class="form-control"
                            placeholder="Write a comment..."
                            rows="3"
                            ></textarea>
              </div>
              <div class="card-footer">
                  <img :src="article.author.image" class="comment-author-img" />
                  <button class="btn btn-sm btn-primary">Post Comment</button>
              </div>
          </form>
  
          <div class="card" v-for="comment in comments" :key="comment.id">
              <div class="card-block">
                  <p class="card-text">{{ comment.body }}</p>
              </div>
              <div class="card-footer">
                  <nuxt-link
                             :to="{
                                  name: 'profile',
                                  params: {
                                  username: comment.author.username,
                                  },
                                  }"
                             class="comment-author"
                             >
                      <img :src="comment.author.image" class="comment-author-img" />
                  </nuxt-link>
                  &nbsp;
                  <nuxt-link
                             :to="{
                                  name: 'profile',
                                  params: {
                                  username: comment.author.username,
                                  },
                                  }"
                             class="comment-author"
                             >
                      {{ comment.author.username }}
                  </nuxt-link>
                  <span class="date-posted">{{
                      comment.createdAt | date("MMM DD, YYYY")
                      }}</span>
              </div>
          </div>
      </div>
  </template>
  
  <script>
      import { getComments } from "@/api/article";
      export default {
          name: "ArticleComments",
          props: {
              article: {
                  type: Object,
                  required: true,
              },
          },
          data () {
              return {
                  comments: [], // 文章列表
              };
          },
          async mounted () {
              // 获取评论数据
              const { data } = await getComments(this.article.slug);
              this.comments = data.comments;
          },
      };
  </script>
  ```









