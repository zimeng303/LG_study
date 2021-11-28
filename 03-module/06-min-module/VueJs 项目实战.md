@[TOC](VueJs 项目实战)

# 一、搭建项目架构

## 创建项目

### 使用 Vue CLI 创建项目



## 使用 TypeScript 开发 Vue 项目

### 在 Vue 项目中启用 TypeScript 支持

**两种方式：**

* 1，全新项目：使用 Vue CLI 脚手架创建 Vue 项目

  ![](F:\LaGou\03-module\06-min-module\assets\02.png)

* 2，已有项目：添加 Vue 官方配置的 TypeScript 适配插件

  使用 @vue/cli 安装 TypeScript 插件：

  ```powershell
  vue add @vue/typescript
  ```

### 关于编辑器

要使用 TypeScript 开发 Vue 应用程序，我们强烈建议您使用 `Visual Studio Code`，它为 TypeScript 提供了极好的 “开箱即用” 的支持。如果你正在使用 `单文件组件`（SFC），可以安装提供 SFC 支持以及其他更多实用功能的 `Vetur 插件`。

`WebStorm` 同样为 TypeScript 和 Vue 提供了 “开箱即用” 的支持。

### TypeScript 相关配置介绍

1，安装了 TypeScript 相关的依赖项

* `dependencies` 依赖：

  | 依赖项                 | 说明                                      |
  | ---------------------- | ----------------------------------------- |
  | vue-class-component    | 提供使用 Class 语法写 Vue 组件            |
  | vue-property-decorator | 在 Class 语法基础之上提供了一些辅助装饰器 |

* `devDependencies` 依赖：

  | 依赖项                           | 说明                                                         |
  | -------------------------------- | ------------------------------------------------------------ |
  | @typescript-eslint/eslint-plugin | 使用 ESLint 校验 TypeScript 代码                             |
  | @typescript-eslint/parser        | 将 TypeScript 转为 AST 供 ESLint 校验使用                    |
  | @vue/cli-plugin-typescript       | 使用 TypeScript + ts-loader + fork-ts-checker-webpack-plugin 进行更快的类型检查 |
  | @vue/eslint-config-typescript    | 兼容 ESLint 的 TypeScript 校验规则                           |
  | typescript                       | TypeScript 编辑器，提供类型校验和转换 JavsScript 功能        |

2，TypeScript 配置文件 `tsconfig.json`

* 具体配置，如下所示：

  ```json
  {
      "compilerOptions": {
          "target": "esnext",
          "module": "esnext",
          "strict": true,
          "jsx": "preserve",
          "importHelpers": true,
          "moduleResolution": "node",
          "experimentalDecorators": true,
          "skipLibCheck": true,
          "esModuleInterop": true,
          "allowSyntheticDefaultImports": true,
          "sourceMap": true,
          "baseUrl": ".",
          "types": [
              "webpack-env"
          ],
          "paths": {
              "@/*": [
                  "src/*"
              ]
          },
          "lib": [
              "esnext",
              "dom",
              "dom.iterable",
              "scripthost"
          ]
      },
      "include": [
          "src/**/*.ts",
          "src/**/*.tsx",
          "src/**/*.vue",
          "tests/**/*.ts",
          "tests/**/*.tsx"
      ],
      "exclude": [
          "node_modules"
      ]
  }
  ```

3，`shims-vue.d.ts` 文件的作用

* 主要用于 TypeScript 识别 `.vue` 文件模块

  ```ts
  // TypeScript 默认不支持导入 `.vue` 模块，这个文件告诉 TypeScript 导入 `.vue` 文件模块都按 `VueConstructor<Vue>` 类型识别处理
  declare module '*.vue' {
    import Vue from 'vue'
    export default Vue
  }
  ```

4，`shims-tsx.d.ts` 文件的作用

* 为 jsx 组件模板补充类型声明

  ```ts
  import Vue, { VNode } from 'vue'
  
  declare global {
      namespace JSX {
          // tslint:disable no-empty-interface
          interface Element extends VNode {}
          // tslint:disable no-empty-interface
          interface ElementClass extends Vue {}
          interface IntrinsicElements {
              [elem: string]: any;
          }
      }
  }
  ```

5，TypeScript 模块都使用 `.ts` 后缀

### 关于装饰器语法

* 代码示例，如下所示：

  ```ts
  import Vue from 'vue'
  import Component from 'vue-class-component'
  
  // Define the component in class-style
  @Component
  export default class Counter extends Vue {
  	// class properties will be component data
      count = 0
  
      // Methods will be component methods
      increment () {
          this.count++
      }
      
      decrement () {
          this.count--
      }
  }
  ```

  [装饰器](https://es6.ruanyifeng.com/#docs/decorator) 是 ES 草案中的一个特性，不过这个草案最近可能发生重大调整，所以不建议在生产环境中使用

* 类的装饰器：

  ```ts
  function testable (target) {
      target.isTestable = true
  }
  
  @testable
  class MyTestableClass {
      // ...
  }
  
  console.log(MyTestableClass.isTestable) // true
  ```

  如果觉得一个参数不够用，可以在 [装饰器](https://www.typescriptlang.org/docs/handbook/decorators.html) 外面再封装一层函数。

  ```ts
  function testable (isTestable) {
      return function (target) {
          target.isTestable = isTestable
      }
  }
  ```

### 定义组件的方式

#### 使用 Options APIs

* 组件仍然可以使用以前的方式定义（导出组件选项对象，或者使用 `Vue.extend()`）

* 但是当我们导出的是一个普通的对象，此时 TypeScript 无法推断出对应的类型

* 至于 VSCode 可以推断出类型成员的原因，是因为我们使用了 Vue 插件

* 这个插件明确知道我们这里导出的是一个 Vue 对象

* 所以，我们必须使用 `Vue.extend()` 方法确保 TypeScript 能够有正常的类型推断

  ```ts
  const Component = {
      // 这里不会有类型推断
      // 因为 TypeScript 不能确认这是 Vue 组件的选项
  }
  ```

  ```ts
  import Vue from 'vue'
  export default Vue.extend({
      // 类型推断已启用
      name: 'Button',
      data () {
          return {
              count: 1
          }
      },
      methods: {
          increment () {
              this.count++
          }
  
          decrement () {
              this.count--
          }
  	}
  })
  ```

#### 使用 Class APIs

* 参考网址：[https://class-component.vuejs.org](https://class-component.vuejs.org)

在 TypeScript 下，Vue 的组件可以使用一个继承自 Vue 类型的子类表示，这种类型需要使用 Component 装饰器去修饰

* 装饰器函数接收的参数，就是以前的组件选项对象（data、props、methods 之类）

  ```ts
  import Vue from 'vue'
  import Component from 'vue-class-component'
  
  // @Component 修饰符注明了此类为一个 Vue 组件
  @Component({
      // 所有的组件选项都可以放在这里
      template: '<button @click="onClick">Click!</button>'
  })
  export default class MyComponent extends Vue {
      // 初始数据可以直接声明为实例的 property
      message: string = 'Hello!'
  
      // 组件方法也可以直接声明为实例的方法
      onClick (): void {
          window.alert(this.message)
      }
  }
  ```

#### 使用 Class APIs + [vue-property-decorator](https://github.com/kaorun343/vue-property-decorator) 定义 Vue 组件

* 具体代码，如下所示：

  ```ts
  import { Vue, Component, Prop } from 'vue-property-decorator'
  
  @Component
  export default class Button extends Vue {
  	private count: number = 1
  	private text: string = 'Click me'
      @Prop() readonly size?: string
      
      get content () {
          return `${this.text} ${this.count}`
      }
  
      increment () {
          this.count++
      }
      
      mounted () {
  		console.log('button is mounted')
      }
  }
  ```

  这种方式继续放大了 Class 这种组件定义方法。

**个人建议**

No Class APIs，只用 Options APIs

> Class 语法仅仅是一种写法而已，最终还是要转换为普通的组件数据结构。
>
> 装饰器语法还没有正式定稿发布，建议了解即可，正式发布以后在选择使用也可以

使用 Options APIs 最好是使用 `export default Vue.extend({ ... })`，而不是 `export default { ... }`

## 代码格式规范

## 布局

### 导入 Element 组件库

### 初始化路由页面组件



## 样式处理

* 目录结构，如下所示：

  ```markdown
  src/styles
  ├── index.scss # 全局样式（在⼊⼝模块被加载⽣效）
  ├── mixin.scss # 公共的 mixin 混⼊（可以把重复的样式封装为 mixin 混⼊到复⽤的地方）
  ├── reset.scss # 重置基础样式
  └── variables.scss # 公共样式变量
  ```

* `variables.scss`

  ```scss
  $primary-color: #40586F;  
  $success-color: #51cf66;  
  $warning-color: #fcc419;
  $danger-color: #ff6b6b;
  $info-color: #868e96; // #22b8cf;  6
  $body-bg: #E9EEF3; // #f5f5f9;
  
  $sidebar-bg: #F8F9FB;
  $navbar-bg: #F8F9FB;
  
  $font-family: system-ui, -apple-system, "Segoe UI", Roboto, Helve tica, Arial, sans-serif;
  ```

* `index.scss`

  ```scss
  @import './variables.scss';  
  // globals
  html {
      font-family: $font-family;
      -webkit-text-size-adjust: 100%;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      // better Font Rendering
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
  }
  
  body {
      margin: 0;
      background-color: $body-bg;
  }
  
  // custom element theme
  $--color-primary: $primary-color;
  $--color-success: $success-color;
  $--color-warning: $warning-color;
  $--color-danger: $danger-color;
  $--color-info: $info-color;
  // change font path, required
  $--font-path: '~element-ui/lib/theme-chalk/fonts';
  
  // import element default theme
  @import '~element-ui/packages/theme-chalk/src/index';
  // node_modules/element-ui/packages/theme-chalk/src/common/var.scss
  
  // overrides
  
  // .el-menu-item, .el-submenu__title {
  //   height: 50px;
  //   line-height: 50px;
  // }
  
  .el-pagination {
      color: #868e96;
  }
  
  // components
  
  .status {
      display: inline-block;
      cursor: pointer;
      width: .875rem;
      height: .875rem;
      vertical-align: middle;
      border-radius: 50%;
  
      &-primary {
          background: $--color-primary;
      }
  
      &-success {
          background: $--color-success;
      }
  
      &-warning {
          background: $--color-warning;
      }
  
      &-danger {
          background: $--color-danger;
      }
  
      &-info {
          background: $--color-info;
      }
  }
  ```

**共享全局样式变量**

* 参考网址：[https://cli.vuejs.org/zh/guide/css.html#向预处理器-loader-传递选项](https://cli.vuejs.org/zh/guide/css.html#向预处理器-loader-传递选项)

* 在 根目录 创建 `vue.config.js`

  ```js
  module.exports = {
      css: {
          loaderOptions: {
              // 默认情况下 `sass` 选项会同时对 `sass` 和 `scss` 语法同时生效
              // 因为 `scss` 语法在内部也是由 sass-loader 处理的
              // 但是在配置 `prependData` 选项的时候
              // `scss` 语法会要求语句结尾必须有分号，`sass` 则要求必须没有分号
              // 在这种情况下，我们可以使用 `scss` 选项，对 `scss` 语法进行单独配置
              scss: {
                  prependData: `@import "~@/styles/variables.scss";`
              }
          }
      }
  }
  ```

# 接口处理

## 配置接口处理

后台为我们提供了数据接口，分别是：

* [https://eduboss.lagou.com](https://eduboss.lagou.com)
* [https://edufront.lagou.com](https://edufront.lagou.com)

这两个接口都没有提供 CORS 跨域请求，所以需要在客户端配置服务端代理处理跨域请求。

配置客户端层面的服务端代理跨域可以参考官方文档中的说明：

* [https://cli.vuejs.org/zh/config/#devserver-proxy](https://cli.vuejs.org/zh/config/#devserver-proxy)
* [https://github.com/chimurai/http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)

下⾯是具体的操作流程。

* 在项⽬根⽬录下添加 `vue.config.js` 配置⽂件

  ```js
  module.exports = {
      ...
      devServer: {
          proxy: {
              '/boss': {
                  target: 'http://eduboss.lagou.com',
                  changeOrigin: true // 把请求头中的 host 配置为 target, 防⽌后端反向代理服务器⽆法识别
              },
              '/front': {
                  target: 'http://edufront.lagou.com',
                  changeOrigin: true
              }
          }
      }
  }
  ```

## 封装请求模块

