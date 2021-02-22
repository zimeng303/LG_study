@[TOC](Vue.js 3.0 源码组织方式)

# Vue.js 3.0 新增特性

## 源码组织方式的变化

## Composition API

## 性能提升

**响应式系统升级**

* Vue.js 2.x 中响应式系统的核心 defineProperty
* Vue.js 3.0 中使用 Proxy 对象重写响应式系统
  * 可以监听动态新增的属性
  * 可以监听删除的属性
  * 可以监听数组的索引和 length 属性

**编译优化**

* Vue.js 2.x 的构建过程

  ![image-20210204160614130](F:\LaGou\03-module\05-min-module\assets\image-6.png)

* Vue.js 2.x 中通过标记静态根节点，优化 diff 的过程

* Vue.js 3.0 中标记和提升所有的静态根节点，diff 的时候只需要对比动态节点内容

  * Fragments（升级 vetur 插件）
  * 静态提升
  * Patch flag
  * 缓存事件处理函数

**源码体积的优化**

* Vue.js 3.0 中移除了一些不常用的 API
  * 例如：inline-template、filter 等
* Tree-shaking

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









