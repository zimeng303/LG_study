@[TOC](Vue.js源码解析)

# 响应式原理

## 课程目标

* Vue.js 的静态成员和实例成员初始化过程
* 首次渲染的过程
* **数据响应式原理** -- 最核心的特性之一

## 准备工作

**Vue 源码的获取**

* 项目地址：[https://github.com/vuejs/vue](https://github.com/vuejs/vue)

* Fork 一份到自己仓库，克隆到本地，可以自己写注释提交到 github

* 为什么分析 Vue 2.6

  1，到目前为止 Vue 3.0 的正式版还没有发布

  2，新版本发布后，现有项目不会升级到 3.0，2.x 还有很长的一段过渡期

  3，3.0 项目地址：[https://github.com/vuejs/vue-next](https://github.com/vuejs/vue-next)

**源码目录结构**

```markdown
src                     源码部分
├─compiler              编译相关 
├─core Vue              核心库 
├─platforms             平台相关代码 
├─server SSR            服务端渲染 
├─sfc .vue              文件编译为 js 对象 
└─shared                公共的代码
```

**了解 Flow**

* 官网：[https://flow.org/](https://flow.org/)

* JavaScript 的**静态类型检查器**

* Flow 的静态类型检查错误是通过静态类型推断实现的

  * 文件开头通过 // @flow 或者 /* @flow */ 声明

  ```js
  /* @flow */ 
  function square(n: number): number { 
      return n * n; 
  }
  square("2"); // Error!
  ```

**调试设置**

****

**打包**

* 打包工具 Rollup

  * Vue.js 源码的打包工具使用的是 Rollup，比 Webpack 轻量
  * Webpack 把所有文件当做模块，Rollup 只处理 js 文件更适合在 Vue.js 这样的库中使用
  * Rollup 打包不会生成冗余的代码

* 安装依赖

  ```powershell
  $ npm i
  ```

* 设置 sourcemap

  * package.json 文件中的 dev 脚本中添加参数 `--sourcemap`
    * `-w`：watch 监视源码的变化，当源码发生变化时，立即重新打包；
    * `-c`：设置配置文件 
    * `--sourcemap`：开启代码地图，在调试时，可以直接进入src中查看源码
    * `--environment`：设置环境变量，通过设置的环境变量，打包不同版本的 Vue

  ```json
  {
      "scripts": {
          "dev": "rollup -w -c scripts/config.js --sourcemap --environment TARGET:web- full-dev"        
      }
  }
  ```

* 执行 dev 

  * npm run dev 执行打包，用的是 rollup，-w 参数是监听文件的变化，文件变化自动重新打包

  * 结果：

    ![image-20201214151455912](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\02-min-module\assets\image-20201214151455912.png)

**调试**

* examples 的示例中引入的 vue.min.js 改为 vue.js

* 打开 Chrome 的调试工具中的 source

  ​	![image-20201214162127444](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\02-min-module\assets\image-20201214162127444.png)

**Vue 的不同构建版本**

* `npm run build` 重新打包所有文件

* [官方文档 - 对不同构建版本的解释](https://cn.vuejs.org/v2/guide/installation.html#%E5%AF%B9%E4%B8%8D%E5%90%8C%E6%9E%84%E5%BB%BA%E7%89%88%E6%9C%AC%E7%9A%84%E8%A7%A3%E9%87%8A)

* dist\README.md

  ![image-20201214164125879](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\02-min-module\assets\image-20201214164125879.png)

**术语**

* **完整版**：同时包含**编译器**和**运行时**的版本。
* **编译器**：用来将模板字符串(template)编译成为 JavaScript 渲染函数(render --> vnode)的代码，体积大、效率低。
* **运行时**：用来创建 Vue 实例、渲染并处理虚拟 DOM 等的代码，体积小、效率高。基本上就是**除去编译器**的代码。
* **[UMD](https://github.com/umdjs/umd)**：UMD 版本**通用的模块版本**，支持多种模块方式。 `vue.js` 默认文件就是运行时 + 编译器的UMD 版本
* **[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)**(cjs)**：CommonJS 版本用来配合老的打包工具比如 [Browserify](http://wiki.commonjs.org/wiki/Modules/1.1) 或 [webpack 1](https://webpack.github.io/)。
* **[ES Module](https://exploringjs.com/es6/ch_modules.html)**：从 2.6 开始 Vue 会提供两个 ES Modules (ESM) 构建文件，为现代打包工具提供的版本。
  * ESM 格式被设计为可以被静态分析，所以打包工具可以利用这一点来进行“tree-shaking”并将用不到的代码排除出最终的包。
  * [ES6 模块与 CommonJS 模块的差异](http://es6.ruanyifeng.com/#docs/module-loader#ES6-%E6%A8%A1%E5%9D%97%E4%B8%8E-CommonJS-%E6%A8%A1%E5%9D%97%E7%9A%84%E5%B7%AE%E5%BC%82)

**Runtime + Compiler vs. Runtime-only**

* 举例比较，代码如下：

  ```js
  // compiler
  // 需要编译器，把 template 转换成 render 函数
  // const vm = new Vue({
  //   el: '#app',
  //   template: '<h1>{{ msg }}</h1>',
  //   data: {
  //     msg: 'Hello Vue'
  //   }
  // })
  
  const vm = new Vue({
      el: '#app',
      // template: '<h1>{{ msg }}</h1>',
      render(h) {
          return h('h1', this.msg)
      },
      data: {
          msg: 'Hello Vue'
      }
  })
  ```

* 推荐使用运行时版本，因为运行时版本相比完整版体积要小大约 30%

* 基于 Vue-CLI 创建的项目默认使用的是 `vue.runtime.esm.js`

  * 通过查看 webpack 的配置文件

    ```powershell
    $ vue inspect > output.js
    ```

* **注意**：`.vue` 文件中的模板是在构建时预编译的，最终打包后的结果不需要编译器，只需要运行

  时版本即可。

## 构建过程

**寻找入口文件**

<hr />

**`查看 dist/vue.js 的构建过程`**

**执行构建**

* 运行构建命令，命令如下：

  ```powershell
  $ npm run dev 
  ```

  即，package.json 中配置的 NPM Scripts 命令，配置如下：

   `--environment TARGET:web-full-dev` 设置环境变量 TARGET

  ```json
  {
      "scripts": {
          "dev": "rollup -w -c scripts/config.js --sourcemap --environment TARGET:web-full-dev"
      }
  } 
  ```

**`script/config.js 的执行过程`**

* 作用：生成 rollup 构建的配置文件

* 使用环境变量 TARGET = web-full-dev

  ```js
  // 判断环境变量是否有 TARGET
  // 如果有的话 使用 genConfig() 生成 rollup 配置文件
  if (process.env.TARGET) {
    module.exports = genConfig(process.env.TARGET)
  } else {
    // 否则获取全部配置
    exports.getBuild = genConfig
    exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
  }
  ```

* genConfig(name)

  * 根据环境变量 TARGET 获取配置信息
  * builds[name] 获取生成配置的信息

  ```js
  // Runtime+compiler development build (Browser)
  'web-full-dev': {
  	entry: resolve('web/entry-runtime-with-compiler.js'),
  	dest: resolve('dist/vue.js'),
  	format: 'umd',
  	env: 'development',
  	alias: { he: './entity-decoder' },
  	banner
  },
  ```

* resolve()

  * 获取入口和出口文件的绝对路径

  ```js
  const aliases = require('./alias')
  // 将传入的路径转换为绝对路径
  const resolve = p => {
      // 根据路径中的前半部分去 alias 模块中找别名对应的路径
      const base = p.split('/')[0]
      if (aliases[base]) {
          return path.resolve(aliases[base], p.slice(base.length + 1))
      } else {
          return path.resolve(__dirname, '../', p)
      }
  }
  ```

* alias 模块

  * 定义别名，简化路径书写

  ```js
  // 将传入的参数 转化为 绝对路径
  // __dirname 当前文件所在的绝对路径
  const resolve = p => path.resolve(__dirname, '../', p)
  
  module.exports = {
      vue: resolve('src/platforms/web/entry-runtime-with-compiler'),
      compiler: resolve('src/compiler'),
      core: resolve('src/core'),
      shared: resolve('src/shared'),
      web: resolve('src/platforms/web'),
      weex: resolve('src/platforms/weex'),
      server: resolve('src/server'),
      sfc: resolve('src/sfc')
  }
  ```

**结果**

* 把 src/platforms/web/entry-runtime-with-compiler.js 构建成 dist/vue.js，如果设置 --sourcemap 会生成 vue.js.map
* src/platform 文件夹下是 Vue 可以构建成不同平台下使用的库，目前有 weex 和 web，还有服务器端渲染的库

## 源码解析

### 从入口开始

<hr />

* src/platform/web/entry-runtime-with-compiler.js

**通过查看源码解决下面问题**

* 观察以下代码，通过阅读源码，回答在页面上输出的结果

  ```js
  // 如果同时设置template和render此时会渲染什么？
  const vm = new Vue({
      el: '#app',
      template: '<h1>Hello Template</h1>',
      render(h) {
          return h('h1', 'Hello Render')
      }
  })
  ```

* 阅读源码记录

  * el 不能是 body 或者 html 标签
  * 如果没有 render，把 template 转换成 render 函数
  * 如果有 render 方法，直接调用 mount 挂载 DOM

  ```js
  // 保留 Vue 实例的 $mount 方法
  const mount = Vue.prototype.$mount
  // $mount 将生成的代码挂载到页面中
  Vue.prototype.$mount = function (
  // el: 创建 vue 实例时，传入的选项
  el?: string | Element,
   // 非 SSR 情况下为 false，SSR 时为 true
   hydrating?: boolean
  ): Component {
      // 获取 el 对象，即 DOM 对象
      el = el && query(el)
  
      /* istanbul ignore if */
      // el 不能是 body 或者 html
      if (el === document.body || el === document.documentElement) {
          process.env.NODE_ENV !== 'production' && warn(
              `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
          )
          return this
      }
      // 创建 vue 实例时，传入的选项
      const options = this.$options
      // resolve template/el and convert to render function 
      if (!options.render) {
          // 把 template/el 转换成 render 函数
          ......
      }
  	// 调用 mount 方法，渲染 DOM
  	return mount.call(this, el, hydrating)
  }
  ```

* 调试代码

  * 调试的方法

  ```js
  const vm = new Vue({
      el: '#app',
      template: '<h1>Hello Template</h1>',
      render(h) {
          return h('h1', 'Hello Render')
      }
  })
  ```

  * 浏览器调试

  ![image-20201215101414090](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\02-min-module\assets\image-20201215101414090.png)

* 遗留问题

  > Vue 的构造函数在哪？
  >
  > Vue 实例的成员/Vue 的静态成员从哪里来的？

**Vue** **的构造函数在哪里**

* src/platform/web/entry-runtime-with-compiler.js 中引用了 './runtime/index'

* `src/platform/web/runtime/index.js`

  * 设置 Vue.confifig
  * 设置平台相关的指令和组件
    * 指令 v-model、v-show
    * 组件 transition、transition-group
  * 设置平台相关的 __patch__ 方法（打补丁方法，对比新旧的 VNode）
  * **设置** **$mount** **方法，挂载** **DOM**

  <font color="#999999">源码如下：(src/platform/web/runtime/index.js) </font>

  ```js
  // install platform runtime directives & components
  // 注册跟平台相关的全局的指令和组件
  // extend() ，将第二个参数的对象所有成员，复制到第一个对象成员中
  // extend() ，复制对象成员的功能
  extend(Vue.options.directives, platformDirectives)
  extend(Vue.options.components, platformComponents)
  
  // install platform patch function
  // __patch__ 将 vnode 转换成 真实 DOM
  // noop 是一个空函数
  Vue.prototype.__patch__ = inBrowser ? patch : noop
  
  // public mount method
  Vue.prototype.$mount = function (
  el?: string | Element,
   hydrating?: boolean
  ): Component {
      el = el && inBrowser ? query(el) : undefined
      return mountComponent(this, el, hydrating)
  }
  ```

* src/platform/web/runtime/index.js 中引用了 'core/index'

* src/core/index.js

  * 定义了 Vue 的静态方法
  * initGlobalAPI(Vue)

* src/core/index.js 中引用了 './instance/index'

* `src/core/instance/index.js`

  * 定义了 Vue 的构造函数

  <font color="#999999">源码如下：(src/core/instance/index.js) </font>

  ```js
  // 1. 创建 Vue 构造函数
  // 此处不用 class 的原因，是因为方便后续给Vue 实例混入实例成员
  function Vue (options) {
      if (process.env.NODE_ENV !== 'production' &&
          !(this instanceof Vue) // this 是否指向 Vue 的实例
         ) {
          warn('Vue is a constructor and should be called with the `new` keyword')
      }
      // 调用 _init() 方法
      this._init(options)
  }
  
  // 2. 注册 Vue 实例成员
  // 注册 vm 的 _init() 方法，初始化 vm
  initMixin(Vue)
  // 注册 vm 的 $data/$props/$set/$delete/$watch
  stateMixin(Vue)
  // 初始化事件相关方法
  // $on/$once/$off/$emit
  eventsMixin(Vue)
  // 初始化生命周期相关的混入方法
  // _update()/$forceUpdate/$destroy
  lifecycleMixin(Vue)
  // 混入 render
  // $nextTick/_render
  renderMixin(Vue)
  ```

**四个导出** **Vue** **的模块**

* src/**platforms/web**/entry-runtime-with-compiler.js

  ![image-20201215143938085](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\02-min-module\assets\image-20201215143938085.png)

  * web 平台相关的入口，重点实现编译
  * 重写了平台相关的 $mount() 方法，将 `template` 转换成 `render` 函数
  * 注册了 Vue.compile() 方法，传递一个 HTML 字符串返回 render 函数

* src/**platforms/web**/runtime/index.js

  ![image-20201215144037464](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\02-min-module\assets\image-20201215144037464.png)

  * web 平台相关
  * 注册和平台相关的全局指令：`v-model`、`v-show`
  * 注册和平台相关的全局组件： `v-transition`、`v-transition-group`
  * 全局方法：
    * `__patch__`：把虚拟 DOM 转换成真实 DOM
    * `$mount`：挂载方法，将 DOM 渲染到页面中

* src/**core**/index.js

  ![image-20201215144127497](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\02-min-module\assets\image-20201215144127497.png)

  * 与平台无关
  * 设置了 Vue 的静态方法，initGlobalAPI(Vue)

* src/**core**/instance/index.js

  ![image-20201215144213272](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\02-min-module\assets\image-20201215144213272.png)

  * 与平台无关
  * 定义了构造函数，调用了 this._init(options) 方法
  * 给 Vue 中混入了常用的实例成员

### Vue 的初始化

<hr />

**src/core/global-api/index.js**

* 初始化 Vue 的静态方法

  ![image-20201215163407080](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\02-min-module\assets\image-20201215163407080.png)

* 具体实现，源码如下：

  `src/core/index.js`

  ```js
  // 注册 Vue 的静态属性/方法 
  initGlobalAPI(Vue) 
  ```

  `src/core/global-api/index.js `

  ```js
  // 初始化 Vue.config 对象
  // 在 Vue 中 定义 config 属性
  Object.defineProperty(Vue, 'config', configDef)
  
  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  // 这些工具方法不视作全局API的一部分，除非你已经意识到某些风险，否则不要去依赖他们
  Vue.util = {
      warn,
      extend,
      mergeOptions,
      defineReactive
  }
  
  // 静态方法 set/delete/nextTick
  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick
  
  // 2.6 explicit observable API
  // 让一个对象可响应，设置响应式数据
  Vue.observable = <T>(obj: T): T => {
      observe(obj)
      return obj
  }
  
  // 初始化 Vue.options 对象，并给其扩展
  // components/directives/filters
  Vue.options = Object.create(null) // 原型等于 null，即不需要原型，提高性能
  ASSET_TYPES.forEach(type => {
      Vue.options[type + 's'] = Object.create(null)
  })
  
  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue
  
  // 设置 keep-alive 组件
  // Vue.options.components 注册全局组件
  extend(Vue.options.components, builtInComponents)
  
  // 注册 Vue.use() 用来注册插件
  initUse(Vue)
  // 注册 Vue.mixin() 实现混入
  initMixin(Vue)
  // 注册 Vue.extend() 基于传入的 options 返回一个组件的构造函数
  initExtend(Vue)
  // 注册 Vue.directive()、Vue.component()、Vue.filter()
  initAssetRegisters(Vue)
  ```

**src/core/instance/index.js**

* 定义 Vue 的构造函数

* 初始化 Vue 的实例成员

  ```js
  // 此处不用 class 的原因，是因为方便后续给Vue 实例混入实例成员
  // 1，创建 Vue 构造函数
  function Vue (options) {
      if (process.env.NODE_ENV !== 'production' &&
          !(this instanceof Vue) // this 是否指向 Vue 的实例
         ) {
          warn('Vue is a constructor and should be called with the `new` keyword')
      }
      // 调用 _init() 方法
      this._init(options)
  }
  
  // 2，注册 Vue 实例成员
  // 注册 vm 的 _init() 方法，初始化 vm
  initMixin(Vue)
  // 注册 vm 的属性：$data/$props 
  // 注册 vm 的方法：$set/$delete/$watch
  stateMixin(Vue)
  // 初始化事件相关方法
  // $on/$once/$off/$emit
  eventsMixin(Vue)
  // 初始化生命周期相关的混入方法
  // _update()/$forceUpdate/$destroy
  lifecycleMixin(Vue)
  // 混入 render
  // $nextTick/_render
  renderMixin(Vue)
  ```

* initMixin(Vue)

  * 初始化 _init() 方法

  ```js
  export function initMixin (Vue: Class<Component>) {
      // 给 Vue 实例增加 _init() 方法
      // 合并 options / 初始化操作
      // 整个 Vue 的入口
      Vue.prototype._init = function (options?: Object) {
          const vm: Component = this
          // a uid 
          // 唯一标识
          vm._uid = uid++
  
          let startTag, endTag
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
              startTag = `vue-perf-start:${vm._uid}`
              endTag = `vue-perf-end:${vm._uid}`
              mark(startTag)
          }
  
          // a flag to avoid this being observed
          // 如果是 Vue 实例，则不需要被 observe
          vm._isVue = true
          // merge options
          // 合并 options
          if (options && options._isComponent) {
              // optimize internal component instantiation
              // since dynamic options merging is pretty slow, and none of the
              // internal component options needs special treatment.
              initInternalComponent(vm, options)
          } else {
              vm.$options = mergeOptions(
                  resolveConstructorOptions(vm.constructor),
                  options || {},
                  vm
              )
          }
          /* istanbul ignore else */
          if (process.env.NODE_ENV !== 'production') {
              initProxy(vm)
          } else {
              vm._renderProxy = vm
          }
          // expose real self
          vm._self = vm
          // vm 的生命周期相关变量初始化
          // $children/$parent/$root/$refs
          initLifecycle(vm)
          // vm 的事件监听初始化，父组件绑定在当前组件上的事件
          initEvents(vm)
          // vm 的编译 render 初始化
          // $slots/$scopedSlots/_c/$createElement/$attrs/$listeners
          initRender(vm)
          // beforeCreate 生命钩子的回调
          callHook(vm, 'beforeCreate')
          // 把 inject 的成员注入到 vm 上，实现依赖注入
          initInjections(vm) // resolve injections before data/props
          // 初始化 vm 的 _props/methods/_data/computed/watch
          initState(vm)
          // 初始化 provide，实现依赖注入
          initProvide(vm) // resolve provide after data/props
          // created 生命钩子的回调
          callHook(vm, 'created')
  
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
              vm._name = formatComponentName(vm, false)
              mark(endTag)
              measure(`vue ${vm._name} init`, startTag, endTag)
          }
  
          if (vm.$options.el) {
              // 调用 $mount() 挂载整个页面
              vm.$mount(vm.$options.el)
          }
      }
  }
  ```

### 首次渲染过程

<hr />

* Vue 初始化完毕，开始真正的执行

* 调用 new Vue() 之前，已经初始化完毕

* 通过调试代码，记录首次渲染过程

  ![首次渲染过程](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\02-min-module\assets\首次渲染过程.png)

### 数据响应式原理

<hr />

**通过查看源码解决下面问题**

* vm.msg = { count: 0 } ，重新给属性赋值，是否是响应式的？
* vm.arr[0] = 4 ，给数组元素赋值，视图是否会更新
* vm.arr.length = 0 ，修改数组的 length，视图是否会更新
* vm.arr.push(4) ，视图是否会更新

**响应式处理的入口**

整个响应式处理的过程是比较复杂的，下面我们先从

* src\core\instance\init.js

  * initState(vm) vm 状态的初始化
  * 初始化了 _data、_props、methods 等

* src\core\instance\state.js

  ```js
  // 数据的初始化
  if (opts.data) {
      initData(vm)
  } else {
      // observe() 将对象转换为响应式对象
      observe(vm._data = {}, true /* asRootData */)
  }
  ```

* initData(vm) vm 数据的初始化

  ```js
  function initData (vm: Component) {
      let data = vm.$options.data
      // 初始化 _data,组件中 data 是函数，调用函数返回结果
      // 否则直接返回 data
      data = vm._data = typeof data === 'function'
          ? getData(data, vm)
      : data || {}
      ......
      // proxy data on instance
      // 获取 data 中的所有属性
      const keys = Object.keys(data)
      // 获取 props / methods
      const props = vm.$options.props
      const methods = vm.$options.methods
      let i = keys.length
      // 判断 data 上的成员是否和 props/methods 重名
     ......
      // observe data
      // 响应式处理
      observe(data, true /* asRootData */)
  }
  
  ```

* src\core\observer\index.js

  * observe(value, asRootData) 
  * 负责为每一个 Object 类型的 value 创建一个 observer 实例

  ```js
  /**
   * Attempt to create an observer instance for a value,
   * returns the new observer if successfully observed,
   * or the existing observer if the value already has one.
   */
  // 创建一个 observer 实例，
  // 如果存在，则返回存在的 observer 实例；
  // 如果不存在，则返回一个新的 observer 实例
  export function observe(value: any, asRootData: ?boolean): Observer | void {
      // 判断 value 是否是对象 或者 value 是否是 VNode 的实例
      if (!isObject(value) || value instanceof VNode) {
          return
      }
      // ob 是 Observer 的实例
      let ob: Observer | void
      // 如果 value 有 __ob__(observer对象) 属性 结束
      if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
          // 此处相当于做了缓存处理
          ob = value.__ob__
      } else if (
          shouldObserve &&
          !isServerRendering() &&
          (Array.isArray(value) || isPlainObject(value)) &&
          Object.isExtensible(value) &&
          !value._isVue
      ) {
          // 创建一个 Observer 对象
          ob = new Observer(value)
      }
      if (asRootData && ob) {
          ob.vmCount++
      }
      return ob
  }
  ```

**Observer**

* src\core\observer\index.js

  * 对对象做响应化处理
  * 对数组做响应化处理

  ```js
  // 对数组或对象做响应式处理
  export class Observer {
      // 观察对象
      value: any;
      // 依赖对象
      dep: Dep;
      // 实例计数器
      vmCount: number; // number of vms that have this object as root $data
  
      constructor(value: any) {
          this.value = value
          this.dep = new Dep()
          // 初始化实例的 vmCount 为0
          this.vmCount = 0
          // 将实例挂载到观察对象的 __ob__ 属性
          // def(), 对 Object.defineProperty() 的封装
          def(value, '__ob__', this)
          // 数组的响应式处理
          if (Array.isArray(value)) {
              if (hasProto) {
                  protoAugment(value, arrayMethods)
              } else {
                  copyAugment(value, arrayMethods, arrayKeys)
              }
              // 为数组中的每一个对象创建一个 observer 实例
              this.observeArray(value)
          } else {
              // 遍历对象中的每一个属性，转换成 setter / getter
              this.walk(value)
          }
      }
  
      /**
         * Walk through all properties and convert them into
         * getter/setters. This method should only be called when
         * value type is Object.
         */
      walk(obj: Object) {
          // 获取观察对象的每一个属性
          const keys = Object.keys(obj)
          // 遍历每一个属性，设置为响应式数据
          for (let i = 0; i < keys.length; i++) {
              defineReactive(obj, keys[i])
          }
      }
  
      /**
         * Observe a list of Array items.
         */
      observeArray(items: Array<any>) {
          for (let i = 0, l = items.length; i < l; i++) {
              observe(items[i])
          }
      }
  }
  ```

* walk(obj) 
  
  * 遍历 obj 的所有属性，为每一个属性调用 defifineReactive() 方法，设置 getter/setter

**defifineReactive()**

* src\core\observer\index.js
* defifineReactive(obj, key, val, customSetter, shallow)
  * 为一个对象定义一个响应式的属性，每一个属性对应一个 dep 对象
  * 如果该属性的值是对象，继续调用 observe
  * 如果给属性赋新值，继续调用 observe
  * 如果数据更新发送通知

**对象响应式处理**

* 具体实现，源码如下：

  ```js
  /**
   * Define a reactive property on an Object.
   */
  // 为一个对象定义一个响应式的属性
  export function defineReactive(
      // 目标对象
      obj: Object, 
       // 转换的属性
       key: string,
       // 转换的属性的属性值
       val: any,
       // 用户自定义的 setter 函数
       customSetter?: ?Function,
       // true，只监听对象的第一层属性；
       // false，深度监听，即当内部的属性为对象时，深度监听属性内部的属性
       shallow?: boolean 
  ) {
      // 创建依赖对象实例
      // 负责为当前属性 key 收集依赖，即收集当前观察属性的 Watcher
      const dep = new Dep()
  
      // 获取 obj 的属性描述符对象
      const property = Object.getOwnPropertyDescriptor(obj, key)
      // property.configurable === false
      // 即 不可以通过 delete 删除，
      // 并且不可以通过 Object.defineProperty() 进行重新设置
      if (property && property.configurable === false) {
          return
      }
  
      // 提供预定义的存取器函数
      // cater for pre-defined getter/setters
      const getter = property && property.get
      const setter = property && property.set
      if ((!getter || setter) && arguments.length === 2) {
          val = obj[key]
      }
  
      // 判断是否递归观察子对象，并将子对象属性都转换成 getter/setter，返回子观察对象
      let childOb = !shallow && observe(val)
      Object.defineProperty(obj, key, {
          enumerable: true,
          configurable: true,
          get: function reactiveGetter() {
              // 如果预定义的 getter 存在则 value 等于 getter 调用的返回值
              // 否则直接赋予属性值
              const value = getter ? getter.call(obj) : val
              // 如果存在当前依赖目标，即 watcher 对象，则建立依赖
              if (Dep.target) {
                  // 收集依赖
                  // dep() 添加相互的依赖 
                  // 1个组件对应一个 watcher 对象 
                  // 1个watcher会对应多个dep（要观察的属性很多） 
                  // 手动创建多个 watcher 监听1个属性的变化，1个dep可以对应多个watcher
                  dep.depend()
                  // 如果子观察目标存在，建立子对象的依赖关系
                  if (childOb) {
                      // 给子对象添加依赖
                      childOb.dep.depend()
                      // 如果属性是数组，则特殊处理收集数组对象依赖
                      if (Array.isArray(value)) {
                          dependArray(value)
                      }
                  }
              }
              // 返回属性值
              return value
          },
          set: function reactiveSetter(newVal) {
              // 如果预定义的 getter 存在则 value 等于 getter 调用的返回值
              // 否则直接赋予属性值
              const value = getter ? getter.call(obj) : val
              // 如果新值等于旧值 或者 新值旧值为 NaN，则不执行
              /* eslint-disable no-self-compare */
              if (newVal === value || (newVal !== newVal && value !== value)) {
                  return
              }
              /* eslint-enable no-self-compare */
              if (process.env.NODE_ENV !== 'production' && customSetter) {
                  customSetter()
              }
              // 如果没有 setter 直接返回
              // #7981: for accessor properties without setter
              if (getter && !setter) return
              // 如果预定义 setter 存在则调用，否则直接更新新值
              if (setter) {
                  setter.call(obj, newVal)
              } else {
                  val = newVal
              }
              // 如果新值是对象，观察子对象并返回子的 observer 对象
              childOb = !shallow && observe(newVal)
              // 派发更新（发布更改通知）
              dep.notify()
          }
      })
  }
  ```

**数组的响应式处理**

* Observer 的构造函数中

  ```js
  // 数组的响应式处理
  if (Array.isArray(value)) {
      // 判断当前浏览器是否支持对象的原型属性(__proto__)
      // 处理兼容性
      if (hasProto) {
          // 重新设置当前对象的原型属性(__proto__)
          // 当前对象的原型属性 指向 arrayMethods
          protoAugment(value, arrayMethods)
      } else {
          // arrayKeys 获取修改数组的方法
          // 将修改后数组方法，重新设置到数据对象的原型中
          copyAugment(value, arrayMethods, arrayKeys)
      }
      // 为数组中的每一个对象创建一个 observer 实例
      this.observeArray(value)
  } else {
      // 遍历对象中的每一个属性，转换成 setter / getter
      this.walk(value)
  }
  
  
  function protoAugment(target, src: Object) {
      /* eslint-disable no-proto */
      target.__proto__ = src
      /* eslint-enable no-proto */
  }
  
  /* istanbul ignore next */
  function copyAugment(target: Object, src: Object, keys: Array<string>) {
      for (let i = 0, l = keys.length; i < l; i++) {
          const key = keys[i]
          def(target, key, src[key])
      }
  }
  ```

* 处理数组修改数据的方法

  * src\core\observer\array.js

  ```js
  const arrayProto = Array.prototype
  // 克隆数组的原型，即 使用数组的原型创建一个新的对象
  export const arrayMethods = Object.create(arrayProto)
  
  // 修改数组元素的方法
  const methodsToPatch = [
      'push',
      'pop',
      'shift',
      'unshift',
      'splice',
      'sort',
      'reverse'
  ]
  
  /**
   * Intercept mutating methods and emit events
   */
  methodsToPatch.forEach(function (method) {
      // cache original method
      // 保存数组原方法
      const original = arrayProto[method]
      // 调用 Object.defineProperty() 重新定义修改数组的方法
      def(arrayMethods, method, function mutator (...args) {
          // 执行数组的原始方法
          const result = original.apply(this, args)
          // 获取数组对象的 ob 对象
          const ob = this.__ob__
          let inserted
          switch (method) {
              case 'push':
              case 'unshift':
                  inserted = args
                  break
              case 'splice':
                  inserted = args.slice(2)
                  break
          }
          // 对插入的新元素，重新遍历数组元素 设置为响应式数据
          if (inserted) ob.observeArray(inserted)
          // notify change
          // 调用了修改数组的方法，调用数组的 ob对象发送通知
          ob.dep.notify()
          return result
      })
  })
  ```

**Dep** **类**

* src\core\observer\dep.js

* 依赖对象

* 记录 watcher 对象

* depend() -- watcher 记录对应的 dep

* 发布通知

  ```markdown
  1. 在 defineReactive() 的 getter 中创建 dep 对象，并判断 Dep.target 是否有值（一会 再来看有什么 时候有值得）, 调用 dep.depend() 
  2. dep.depend() 内部调用 Dep.target.addDep(this)，也就是 watcher 的 addDep() 方 法，它内部最 调用 dep.addSub(this)，把 watcher 对象，添加到 dep.subs.push(watcher) 中，也 就是把订阅者 添加到 dep 的 subs 数组中，当数据变化的时候调用 watcher 对象的 update() 方法 
  3. 什么时候设置的 Dep.target? 通过简单的案例调试观察。调用 mountComponent() 方法的时 候，创建了 渲染 watcher 对象，执行 watcher 中的 get() 方法 
  4. get() 方法内部调用 pushTarget(this)，把当前 Dep.target = watcher，同时把当前 watcher 入栈， 因为有父子组件嵌套的时候先把父组件对应的 watcher 入栈，再去处理子组件的 watcher，子 组件的处理完毕 后，再把父组件对应的 watcher 出栈，继续操作 
  5. Dep.target 用来存放目前正在使用的watcher。全局唯一，并且一次也只能有一个 watcher 被使用
  ```

  ```js
  /**
   * A dep is an observable that can have multiple
   * directives subscribing to it.
   */
  // dep 是个可观察对象，可以有多个指令订阅它
  export default class Dep {
      // 静态属性，watcher 对象
      static target: ?Watcher;
      // dep 实例 Id 
      id: number;
      // dep 实例对应的 watcher 对象/订阅者数组
      subs: Array<Watcher>;
  
      constructor () {
          this.id = uid++
          this.subs = []
      }
  
      // 添加新的订阅者 watcher 对象
      addSub (sub: Watcher) {
          this.subs.push(sub)
      }
  
      // 移除订阅者
      removeSub (sub: Watcher) {
          remove(this.subs, sub)
      }
  
      // 将观察对象和 watcher 建立依赖
      depend () {
          if (Dep.target) {
              // 如果 target 存在，把 dep 对象添加到 watcher 的依赖中
              Dep.target.addDep(this)
          }
      }
  
      // 发布通知
      notify () {
          // stabilize the subscriber list first
          const subs = this.subs.slice()
          if (process.env.NODE_ENV !== 'production' && !config.async) {
              // subs aren't sorted in scheduler if not running async
              // we need to sort them now to make sure they fire in correct
              // order
              subs.sort((a, b) => a.id - b.id)
          }
          for (let i = 0, l = subs.length; i < l; i++) {
              subs[i].update()
          }
      }
  }
  
  // The current target watcher being evaluated.
  // This is globally unique because only one watcher
  // can be evaluated at a time.
  // Dep.target 用来存放目前正在使用的 watcher
  // 全局唯一，并且一次也只能有一个 watcher 被使用
  Dep.target = null
  const targetStack = []
  
  // 入栈并将当前 watcher 赋值给 Dep.target
  export function pushTarget (target: ?Watcher) {
      // 每一个组件都有一个watcher，组件中存在嵌套时，需要存储父组件中的 watcher 
      targetStack.push(target)
      Dep.target = target
  }
  
  export function popTarget () {
      // 出栈操作
      targetStack.pop()
      Dep.target = targetStack[targetStack.length - 1]
  }
  ```

**Watcher** **类** 

* Watcher 分为三种，Computed Watcher、用户 Watcher (侦听器)、**渲染** **Watcher**

* 渲染 Watcher 的创建时机

  * /src/core/instance/lifecycle.js

  ```js
  
  export function mountComponent (
  vm: Component,
   el: ?Element,
   hydrating?: boolean
  ): Component {
      vm.$el = el
     ......
      callHook(vm, 'beforeMount')
  
      // 更新组件，实现挂载
      let updateComponent
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
          ......
      } else {
          updateComponent = () => {
              // _update 将 VNode 转换为 真实DOM
              vm._update(vm._render(), hydrating)
          }
      }
  
      // we set this to vm._watcher inside the watcher's constructor
      // since the watcher's initial patch may call $forceUpdate (e.g. inside child
      // component's mounted hook), which relies on vm._watcher being already defined
      new Watcher(vm, updateComponent, noop, {
          // 执行 updateComponent
          before () {
              if (vm._isMounted && !vm._isDestroyed) {
                  callHook(vm, 'beforeUpdate')
              }
          }
      }, true /* isRenderWatcher */)
      hydrating = false
  
      // manually mounted instance, call mounted on self
      // mounted is called for render-created child components in its inserted hook
      if (vm.$vnode == null) {
          vm._isMounted = true
          // 页面挂载完毕
          callHook(vm, 'mounted')
      }
      return vm
  }
  ```

* 渲染 wacher 创建的位置 lifecycle.js 的 mountComponent 函数中

* Wacher 的构造函数初始化，处理 expOrFn （渲染 watcher 和侦听器处理不同）

* 调用 this.get() ，它里面调用 pushTarget() 然后 this.getter.call(vm, vm) （对于渲染 wacher 调用 updateComponent），如果是用户 wacher 会获取属性的值（触发get操作）

* 当数据更新的时候，dep 中调用 notify() 方法，notify() 中调用 wacher 的 update() 方法

* update() 中调用 queueWatcher()

* queueWatcher() 是一个核心方法，去除重复操作，调用 flflushSchedulerQueue() 刷新队列并执行watcher

* flflushSchedulerQueue() 中对 wacher 排序，遍历所有 wacher ，如果有 before，触发生命周期的钩子函数 beforeUpdate，执行 wacher.run()，它内部调用 this.get()，然后调用 this.cb() (渲染wacher 的 cb 是 noop)

* 整个流程结束

**响应式处理过程**

* 具体过程，如图所示：

  ![响应式处理过程](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\02-min-module\assets\响应式处理过程.png)

**调试响应式数据执行过程**

* 数组响应式处理的核心过程和数组收集依赖的过程

* 当数组的数据改变的时候 watcher 的执行过程

  ```html
  <div id="app">
      {{ arr }}
  </div>
  
  <script src="../../dist/vue.js"></script>
  <script>
      const vm = new Vue({
          el: '#app',
          data: {
              arr: [2, 3, 5]
          }
      })
  </script>
  ```

**回答以下问题**

* [检测变化的注意事项](https://cn.vuejs.org/v2/guide/reactivity.html#%E6%A3%80%E6%B5%8B%E5%8F%98%E5%8C%96%E7%9A%84%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9)

  ```js
  methods: { 
      handler () { 
          this.obj.count = 555 
          this.arr[0] = 1 
          this.arr.length = 0 
          this.arr.push(4) 
      } 
  } 
  ```

* 转换成响应式数据

  ```js
  methods: { 
      handler () { 
          this.$set(this.obj, 'count', 555) 
          this.$set(this.arr, 0, 1) 
          this.arr.splice(0) 
      } 
  }
  ```

### [实例方法/数据](https://cn.vuejs.org/v2/api/#%E5%AE%9E%E4%BE%8B%E6%96%B9%E6%B3%95-%E6%95%B0%E6%8D%AE)

**[vm.$set](https://cn.vuejs.org/v2/api/#vm-set)**

* 功能

  向响应式对象中添加一个属性，并确保这个新属性同样是响应式的，且触发视图更新。它必须用于向响应式对象上添加新属性，因为 Vue 无法探测普通的新增属性 (比如this.myObject.newProperty = 'hi')

> **注意：**对象不能是 Vue 实例，或者 Vue 实例的根数据对象。

* 示例

  ```js
  vm.$set(obj, 'foo', 'test')
  ```

**定义位置**

* Vue.set()

  * global-api/index.js

  ```js
  // 静态方法 set/delete/nextTick 
  Vue.set = set 
  Vue.delete = del 
  Vue.nextTick = nextTick
  ```

* vm.$set()

  * instance/index.js

  ```js
  // 注册 vm 的 $data/$props/$set/$delete/$watch 
  // instance/state.js 
  stateMixin(Vue) 
  
  // instance/state.js 
  Vue.prototype.$set = set 
  Vue.prototype.$delete = del
  ```

**源码**

* set() 方法

  * observer/index.js

  ```js
  /**
   * Set a property on an object. Adds the new property and
   * triggers change notification if the property doesn't
   * already exist.
   */
  export function set(target: Array<any> | Object, key: any, val: any): any {
      if (process.env.NODE_ENV !== 'production' &&
          (isUndef(target) || isPrimitive(target))
         ) {
          warn(`Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`)
      }
      // 判断 target 是否是对象，key 是否是合法的索引
      if (Array.isArray(target) && isValidArrayIndex(key)) {
          target.length = Math.max(target.length, key)
          // 通过 splice 对 key 位置的元素进行替换
          // splice 在 array.js 进行了响应化的处理
          target.splice(key, 1, val)
          return val
      }
      // 如果 key 在对象中已经存在，直接赋值
      if (key in target && !(key in Object.prototype)) {
          target[key] = val
          return val
      }
      // 获取 target 中的 observer 对象
      const ob = (target: any).__ob__
      // 如果 target 是 vue 实例或者 $data，直接返回
      if (target._isVue || (ob && ob.vmCount)) {
          process.env.NODE_ENV !== 'production' && warn(
              'Avoid adding reactive properties to a Vue instance or its root $data ' +
              'at runtime - declare it upfront in the data option.'
          )
          return val
      }
      // 如果 ob 不存在，target 不是响应式对象，直接赋值
      if (!ob) {
          target[key] = val
          return val
      }
      // 把 key 设置为响应式属性
      defineReactive(ob.value, key, val)
      // 发送通知，更新视图
      ob.dep.notify()
      return val
  }
  ```

  **调试**

  ```html
  <div id="app">
      {{ obj.mag }}
      <hr>
      {{ obj.foo }}
  </div>
  
  <script src="../../dist/vue.js"></script>
  <script>
      const vm = new Vue({
          el: '#app',
          data: {
              obj: {
                  msg: 'Hello Set'
              }
          }
      })
      // 非响应式数据 
      // vm.obj.foo = 'test' 
      vm.$set(vm.obj, 'foo', 'test')
  </script>
  ```

> 回顾 defifineReactive 中的 childOb，给每一个响应式对象设置一个 **ob**
>
> 调用 $set 的时候，会获取 ob 对象，并通过 ob.dep.notify() 发送通知

**[vm.$delete](https://cn.vuejs.org/v2/api/#vm-delete)**

* 功能

  删除对象的属性。如果对象是响应式的，确保删除能触发更新视图。这个方法主要用于避开 Vue不能检测到属性被删除的限制，但是你应该很少会使用它。

> **注意：**目标对象不能是一个 Vue 实例或 Vue 实例的根数据对象。

* 示例

  ```js
  vm.$delete(vm.obj, 'msg') 1
  ```

**定义位置**

* Vue.delete()

  * global-api/index.js

  ```js
  // 静态方法 set/delete/nextTick 
  Vue.set = set 
  Vue.delete = del 
  Vue.nextTick = nextTick
  ```

* vm.$delete()

  * instance/index.js

  ```js
  // 注册 vm 的 $data/$props/$set/$delete/$watch 
  stateMixin(Vue) 
  
  // instance/state.js 
  Vue.prototype.$set = set 
  Vue.prototype.$delete = del
  ```

**源码**

* src\core\observer\index.js

  ```js
  
  /**
   * Delete a property and trigger change if necessary.
   */
  export function del(target: Array<any> | Object, key: any) {
      if (process.env.NODE_ENV !== 'production' &&
          (isUndef(target) || isPrimitive(target))
         ) {
          warn(`Cannot delete reactive property on undefined, null, or primitive value: ${(target: any)}`)
      }
      // 判断是否是数组，以及 key 是否合法
      if (Array.isArray(target) && isValidArrayIndex(key)) {
          // 如果是数组，通过 splice 删除
          // splice 做过响应式处理
          target.splice(key, 1)
          return
      }
      // 获取 target 的 ob 对象
      const ob = (target: any).__ob__
      // target 如果是 Vue 实例或者 $data 对象，直接返回
      if (target._isVue || (ob && ob.vmCount)) {
          process.env.NODE_ENV !== 'production' && warn(
              'Avoid deleting properties on a Vue instance or its root $data ' +
              '- just set it to null.'
          )
          return
      }
      // 如果 target 对象没有 key 属性，直接返回
      if (!hasOwn(target, key)) {
          return
      }
      // 删除属性
      delete target[key]
      if (!ob) {
          return
      }
      // 通过 ob 发送通知
      ob.dep.notify()
  }
  ```

**[vm.$watch](https://cn.vuejs.org/v2/api/#vm-watch)**

vm.$watch( expOrFn, callback, [options] )

* 功能

  观察 Vue 实例变化的一个表达式或计算属性函数。回调函数得到的参数为新值和旧值。表达式只接受监督的键路径。对于更复杂的表达式，用一个函数取代。

* 参数

  * expOrFn：要监视的 $data 中的属性，可以是表达式或函数
  * callback：数据变化后执行的函数
    * 函数：回调函数
    * 对象：具有 handler 属性(字符串或者函数)，如果该属性为字符串则 methods 中相应的定义
  * options：可选的选项
    * deep：布尔类型，深度监听
    * immediate：布尔类型，是否立即执行一次回调函数

* 示例

  ```js
  const vm = new Vue({ 
      el: '#app', 
      data: { 
          a: '1', 
          b: '2', 
          msg: 'Hello Vue', 
          user: { 
              firstName: '诸葛', 
              lastName: '亮' 
          } 
      } 
  })
  
  // expOrFn 是表达式 
  vm.$watch('msg', function (newVal, oldVal) { 
      console.log(newVal, oldVal) 
  })
  vm.$watch('user.firstName', function (newVal, oldVal) { 
      console.log(newVal) 
  })
  // expOrFn 是函数 
  vm.$watch(function () { 
      return this.a + this.b 
  }, function (newVal, oldVal) { 
      console.log(newVal) 
  })
  // deep 是 true，消耗性能 
  vm.$watch('user', function (newVal, oldVal) { 
      // 此时的 newVal 是 user 对象 
      console.log(newVal === vm.user) 
  }, {
      deep: true 
  })
  // immediate 是 true 
  vm.$watch('msg', function (newVal, oldVal) { 
      console.log(newVal) 
  }, {
      immediate: true 
  })
  ```

**三种类型的** **Watcher** **对象**

* 没有静态方法，因为 $watch 方法中要使用 Vue 的实例
* Watcher 分三种：计算属性 Watcher、用户 Watcher (侦听器)、渲染 Watcher
* 创建顺序：计算属性 Watcher、用户 Watcher (侦听器)、渲染 Watcher
* vm.$watch()
  * src\core\instance\state.js

**源码**

* 具体实现，源码如下：

  ```js
  Vue.prototype.$watch = function (
  expOrFn: string | Function,
   cb: any,
   options?: Object
  ): Function {
      // 获取 Vue 实例 this 
      const vm: Component = this
      if (isPlainObject(cb)) {
          // 判断如果 cb 是对象执行 createWatcher
          return createWatcher(vm, expOrFn, cb, options)
      }
      options = options || {}
      // 标记为用户 watcher
      options.user = true
      // 创建用户 watcher 对象
      const watcher = new Watcher(vm, expOrFn, cb, options)
      // 判断 immediate，如果为 true
      if (options.immediate) {
          // 立即执行一次 cb 回调，并且把当前值传入
          try {
              cb.call(vm, watcher.value)
          } catch (error) {
              handleError(error, vm, `callback for immediate watcher "${watcher.expression}"`)
          }
      }
      // 返回取消监听的方法
      return function unwatchFn () {
          watcher.teardown()
      }
  }
  ```

**调试**

* 查看 watcher 的创建顺序

  * 计算属性 watcher

    ![image-20201217164633114](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\02-min-module\assets\image-20201217164633114.png)

  * 用户 wacher(侦听器)

    ![image-20201217164711868](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\02-min-module\assets\image-20201217164711868.png)

  * 渲染 wacher

    ![image-20201217164748332](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\02-min-module\assets\image-20201217164748332.png)

* 查看渲染 watcher 的执行过程

  * 当数据更新，defifineReactive 的 set 方法中调用 dep.notify()
  * 调用 watcher 的 update()
  * 调用 queueWatcher()，把 wacher 存入队列，如果已经存入，不重复添加
  * 循环调用 flflushSchedulerQueue()
    * 通过 nextTick()，在消息循环结束之前时候调用 flflushSchedulerQueue()
  * 调用 wacher.run()
    * 调用 wacher.get() 获取最新值
    * 如果是渲染 wacher 结束
    * 如果是用户 watcher，调用 this.cb()

**[异步更新队列 -nextTick()](https://cn.vuejs.org/v2/guide/reactivity.html#%E5%BC%82%E6%AD%A5%E6%9B%B4%E6%96%B0%E9%98%9F%E5%88%97)**

<hr />

* Vue 更新 DOM 是异步执行的，批量的
  * 在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
* vm.$nextTick(function () { /* 操作 DOM */ }) / Vue.nextTick(function () {})

**vm.$nextTick()** **代码演示**

* 调试，代码如下：

  ```html
  <div id="app">
      <p id="p" ref="p1">{{ msg }}</p>
  {{ name }}<br>
      {{ title }}<br>
          </div>
  <script src="../../dist/vue.js"></script>
  <script>
      const vm = new Vue({
          el: '#app',
          data: {
              msg: 'Hello nextTick',
              name: 'Vue.js',
              title: 'Title'
          },
          mounted() {
              this.msg = 'Hello World'
              this.name = 'Hello snabbdom'
              this.title = 'Vue.js'
  
              Vue.nextTick(() => {
                  console.log(this.$refs.p1.textContent)
              })
          }
      })
  </script> 
  ```

**定义位置**

* src\core\instance\render.js

  ```js
  Vue.prototype.$nextTick = function (fn: Function) {
      return nextTick(fn, this)
  }
  ```

**源码**

* 手动调用 vm.$nextTick()

* 在 Watcher 的 queueWatcher 中执行 nextTick()

* src\core\util\next-tick.js

  ```js
  let timerFunc
  
  // The nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore next, $flow-disable-line */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
      const p = Promise.resolve()
      timerFunc = () => {
          // 微任务，在本次同步任务执行完毕以后，执行微任务
          p.then(flushCallbacks)
          // In problematic UIWebViews, Promise.then doesn't completely break, but
          // it can get stuck in a weird state where callbacks are pushed into the
          // microtask queue but the queue isn't being flushed, until the browser
          // needs to do some other work, e.g. handle a timer. Therefore we can
          // "force" the microtask queue to be flushed by adding an empty timer.
          if (isIOS) setTimeout(noop)
      }
      // 是否使用 微任务
      isUsingMicroTask = true
      // MutationObserver 监听 DOM 对象的改变
  } else if (!isIE && typeof MutationObserver !== 'undefined' && (
      isNative(MutationObserver) ||
      // PhantomJS and iOS 7.x
      MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
      // Use MutationObserver where native Promise is not available,
      // e.g. PhantomJS, iOS7, Android 4.4
      // (#6466 MutationObserver is unreliable in IE11)
      let counter = 1
      const observer = new MutationObserver(flushCallbacks)
      const textNode = document.createTextNode(String(counter))
      observer.observe(textNode, {
          characterData: true
      })
      timerFunc = () => {
          counter = (counter + 1) % 2
          textNode.data = String(counter)
      }
      isUsingMicroTask = true
  } else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
      // Fallback to setImmediate.
      // Technically it leverages the (macro) task queue,
      // but it is still a better choice than setTimeout.
      // setImmediate 只有 IE 和 Node 支持，始终在 setTimeout 之前执行
      timerFunc = () => {
          setImmediate(flushCallbacks)
      }
  } else {
      // Fallback to setTimeout.
      timerFunc = () => {
          setTimeout(flushCallbacks, 0)
      }
  }
  
  export function nextTick (cb?: Function, ctx?: Object) {
      let _resolve
      // 把 cb 加上异常处理存入 callbacks 数组中
      callbacks.push(() => {
          if (cb) {
              try {
                  // 调用 cb() 回调函数
                  cb.call(ctx)
              } catch (e) {
                  handleError(e, ctx, 'nextTick')
              }
          } else if (_resolve) {
              _resolve(ctx)
          }
      })
      // 判断队列是否正在被处理
      if (!pending) {
          pending = true
          // 调用
          timerFunc()
      }
      // $flow-disable-line
      if (!cb && typeof Promise !== 'undefined') {
          // 返回 promise 对象
          return new Promise(resolve => {
              _resolve = resolve
          })
      }
  }
  ```

# 虚拟 DOM

## 基本介绍

**什么是虚拟** **DOM**

* 虚拟 DOM(Virtual DOM) 是使用 JavaScript 对象来描述 DOM，虚拟 DOM 的本质就是 JavaScript 对象，使用 JavaScript 对象来描述 DOM 的结构。应用的各种状态变化首先作用于虚拟 DOM，最终映射到 DOM。
* Vue.js 中的虚拟 DOM 借鉴了 Snabbdom，并添加了一些 Vue.js 中的特性，
  * 例如：指令和组件机制。

* Vue 1.x 中细粒度监测数据的变化，每一个属性对应一个 watcher，开销太大Vue 2.x 中每个组件对应一个 watcher，状态变化通知到组件，再引入虚拟 DOM 进行比对和渲染

**为什么要使用虚拟** **DOM**

* 使用虚拟 DOM，可以避免用户直接操作 DOM，开发过程关注在业务代码的实现，不需要关注如何操作 DOM，从而提高开发效率
* 作为一个中间层可以跨平台，除了 Web 平台外，还支持 SSR、Weex。
* 关于性能方面，在首次渲染的时候肯定不如直接操作 DOM，因为要维护一层额外的虚拟 DOM，如果后续有频繁操作 DOM 的操作，这个时候可能会有性能的提升，虚拟 DOM 在更新真实 DOM之前会通过 Diffff 算法对比新旧两个虚拟 DOM 树的差异，最终把差异更新到真实 DOM

**Vue.js** **中的虚拟** **DOM**

<hr />

* **演示** **render** **中的** **h** **函数**

  * h 函数就是 createElement()

  ```js
  const vm = new Vue({
      el: '#app',
      render(h) {
          // h(tag, data, children)
          // return h('h1', this.msg)
          // return h('h1', { domProps: { innerHTML: this.msg } })
          // return h('h1', { attrs: { id: 'title' } }, this.msg)
          const vnode = h(
              'h1',
              {
              	attrs: { id: 'title' }
              },
              this.msg
          )
          console.log(vnode)
          return null
      },
      data: {
      	msg: 'Hello Vue'
      }
  })
  ```

**h 函数**

* vm.$createElement(tag, data, children, normalizeChildren)
  * tag
    * 标签名称或者组件对象
  * data
    * 描述 tag，可以设置 DOM 的属性或者标签的属性
  * children
    * tag 中的文本内容或者子节点

**VNode**

* VNode 的核心属性
  * tag
  * data
  * children
  * text
  * elm
    * 记录真实 DOM
  * key
    * 用来复用当前的元素

## 构建过程

**虚拟** **DOM** **创建过程**

<hr />

![虚拟 DOM 整体分析过程](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\02-min-module\assets\整体过程分析.png)

**createElement**

<hr />

**功能**

* createElement() 函数，用来创建虚拟节点 (VNode)，我们的 render 函数中的参数 h，就是createElement()

  ```js
  render(h) { 
      // 此处的 h 就是 vm.$createElement 
      return h('h1', this.msg) 
  }
  ```

**定义**

* `src/core/instance/render.js`

  * 在 vm._render() 中调用了，用户传递的或者编译生成的 render 函数，这个时候传递了 createElement

  ```js
  // 将 template 编译成 render 函数，对编译生成的 render 进行渲染的方法
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
  // normalization is always applied for the public version, used in
  // user-written render functions.
  // 对手写 render 函数进行渲染的方法
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
  ```

* `src/core/vdom/create-element.js`

  * vm.*_c* 和 *vm.$createElement* 内部都调用了 `createElement`，不同的是最后一个参数。*vm.*c 在编译生成的render 函数内部会调用，vm.$createElement 在用户传入的 render 函数内部调用。当用户传入render 函数的时候，要对用户传入的参数做处理

  ```js
  // wrapper function for providing a more flexible interface
  // without getting yelled at by flow
  // 处理用户传入的参数
  export function createElement (
  	context: Component,
  	tag: any,
  	data: any,  // data 可以省略，引入模块，设置样式/属性/事件
  	children: any,
  	normalizationType: any,
  	alwaysNormalize: boolean
  ): VNode | Array<VNode> {
      // 此时 data ，没有传入，即 data --> children
      if (Array.isArray(data) || isPrimitive(data)) {
          normalizationType = children
          children = data
          data = undefined
      }
      // 用户传入的 render 函数
      if (isTrue(alwaysNormalize)) {
          // normalizationType 用来处理参数 children 
          normalizationType = ALWAYS_NORMALIZE
      }
  	return _createElement(context, tag, data, children, normalizationType)
  }
  ```
  * 执行完 createElement 之后创建好了 VNode，把创建好的 VNode 传递给 vm._update() 继续处理

  ```js
  
  // 创建 VNode
  export function _createElement (
      context: Component,
       tag?: string | Class<Component> | Function | Object,
       data?: VNodeData,
       children?: any,
       normalizationType?: number
  ): VNode | Array<VNode> {
      if (isDef(data) && isDef((data: any).__ob__)) {
      	......
  		return createEmptyVNode()
      }
      // <component v-bind:is="currentTabComponent"></component>
      // object syntax in v-bind
      if (isDef(data) && isDef(data.is)) {
      	tag = data.is
      }
      if (!tag) {
          // in case of component :is set to falsy value
          return createEmptyVNode()
      }
      ......
      // 处理作用域插槽
      // support single function children as default scoped slot
      if (Array.isArray(children) && 
          typeof children[0] === 'function'
      ) {
          data = data || {}
          data.scopedSlots = { default: children[0] }
          children.length = 0
      }
      // 用户传过来的 render 函数
      if (normalizationType === ALWAYS_NORMALIZE) {
          // 返回一维数组，处理用户手写的 render
          // 当手写 render 函数的时候调用 
          // 判断 children 的类型，如果是原始值的话转换成 VNode 的数组 
          // 如果是数组的话，继续处理数组中的元素 
          // 如果数组中的子元素又是数组(slot template)，递归处理 
          // 如果连续两个节点都是字符串会合并文本节点
          children = normalizeChildren(children)
      } else if (normalizationType === SIMPLE_NORMALIZE) {
          // 把二维数组，转换成一维数组
          // 如果 children 中有函数组件的话，函数组件会返回数组形式 
          // 这时候 children 就是一个二维数组，只需要把二维数组转换为一维数组
          children = simpleNormalizeChildren(children)
      }
      let vnode, ns
      // 判断 tag 是字符串还是组件
      if (typeof tag === 'string') {
          let Ctor
          ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
          // 如果是浏览器的保留标签，创建对应的 VNode
      	if (config.isReservedTag(tag)) {
              // platform built-in elements
              if (process.env.NODE_ENV !== 'production' && isDef(data) && isDef(data.nativeOn)) {
                  warn(
                  `The .native modifier for v-on is only valid on components but it was used on <${tag}>.`,
                  context
                  )
      		}
              vnode = new VNode(
                  config.parsePlatformTagName(tag), data, children,
                  undefined, undefined, context
              )
          // 判断是否是 自定义组件
          } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
              // 查找自定义组件构造函数的声明
              // 根据 Ctor 创建组件的 VNode
              // component
              vnode = createComponent(Ctor, data, context, children, tag)
      	} else {
              // unknown or unlisted namespaced elements
              // check at runtime because it may get assigned a namespace when its
              // parent normalizes children
              vnode = new VNode(
                  tag, data, children,
                  undefined, undefined, context
              )
          }
      } else {
          // direct component options / constructor
          vnode = createComponent(tag, data, context, children)
      }
      if (Array.isArray(vnode)) {
      	return vnode
      } else if (isDef(vnode)) {
      	if (isDef(ns)) applyNS(vnode, ns)
          if (isDef(data)) registerDeepBindings(data)
          return vnode
      } else {
      	return createEmptyVNode()
      }
  }
  ```

**update**

<hr />

**功能**

* 内部调用 vm.__patch__() 把虚拟 DOM 转换成真实 DOM

**定义**

* `src/core/instance/lifecycle.js`

  ```js
  // _update 方法的作用是把 VNode 渲染成真实的 DOM
  Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
      const vm: Component = this
      const prevEl = vm.$el
      // 之前所处理过的 vnode 对象
      const prevVnode = vm._vnode
      const restoreActiveInstance = setActiveInstance(vm)
      vm._vnode = vnode
      // Vue.prototype.__patch__ is injected in entry points
      // based on the rendering backend used.
      // 判断是否是首次渲染
      if (!prevVnode) {
          // initial render
          // __patch__ 将原来的真实 DOM 转换为 虚拟 DOM，然后与创建的 vnode 进行比较
          // 最后 将虚拟DOM 转换为 真实DOM
          vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
      } else {
          // updates
          vm.$el = vm.__patch__(prevVnode, vnode)
      }
      restoreActiveInstance()
      // update __vue__ reference
      if (prevEl) {
          prevEl.__vue__ = null
      }
      if (vm.$el) {
          vm.$el.__vue__ = vm
      }
      // if parent is an HOC, update its $el as well
      if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
          vm.$parent.$el = vm.$el
      }
      // updated hook is called by the scheduler to ensure that children are
      // updated in a parent's updated hook.
  }
  ```

**patch** **函数初始化**

<hr />

**功能**

* 对比两个 VNode 的差异，把差异更新到真实 DOM。如果是首次渲染的话，会把真实 DOM 先转换成 VNode

**Snabbdom** **中** **patch** **函数的初始化**

* `src/snabbdom.ts`

  ```ts
  export function init (modules: Array<Partial<Module>>, domApi?: DOMAPI) { 
      return function patch (oldVnode: VNode | Element, vnode: VNode): VNode { 
      } 
  }
  ```

* `vnode`

  ```ts
  export function vnode (sel: string | undefined, 
  	data: any | undefined, 
  	children: Array<VNode | string> | undefined, 
  	text: string | undefined, 
  	elm: Element | Text | undefined): VNode { 
      const key = data === undefined ? undefined : data.key 
      return { sel, data, children, text, elm, key } 
  }
  ```

**Vue.js** **中** **patch** **函数的初始化**

* `src/platforms/web/runtime/index.js`

  ```js
  import { patch } from './patch'
  
  // install platform patch function
  // __patch__ 将 vnode 转换成 真实 DOM
  // noop 是一个空函数
  Vue.prototype.__patch__ = inBrowser ? patch : noop
  ```

* `src/platforms/web/runtime/patch.js`

  ```js
  import * as nodeOps from 'web/runtime/node-ops'
  import { createPatchFunction } from 'core/vdom/patch'
  import baseModules from 'core/vdom/modules/index'
  import platformModules from 'web/runtime/modules/index'
  
  // the directive module should be applied last, after all
  // built-in modules have been applied.
  const modules = platformModules.concat(baseModules)
  
  export const patch: Function = createPatchFunction({ nodeOps, modules })
  ```

* `src/core/vdom/patch.js`

  ```js
  // 函数柯里化，让一个函数返回一个函数
  // createPatchFunction({ nodeOps, modules }) 传入平台相关的两个参数
  
  // core 中的createPatchFunction (backend), const { modules, nodeOps } = backend
  // core 中方法和平台无关，传入两个参数后，可以在上面的函数中使用这两个参数
  export function createPatchFunction (backend) {
      let i, j
      const cbs = {}
  
      // modules 节点的属性/事件/样式的操作
      // nodeOps 节点操作
      const { modules, nodeOps } = backend
  
      // hooks 定义了 生命钩子函数
      for (i = 0; i < hooks.length; ++i) {
          // cbs['update'] = []
          cbs[hooks[i]] = []
          for (j = 0; j < modules.length; ++j) {
              if (isDef(modules[j][hooks[i]])) {
                  // cbs['update'] = [updateAttrs, updateClass, update...]
                  cbs[hooks[i]].push(modules[j][hooks[i]])
              }
          }
      }
  	......
  	......
  	......
  	return function patch (oldVnode, vnode, hydrating, removeOnly) {
      	......
  	}
  }
  ```

**patch** **函数执行过程**

* patch 函数，具体实现过程如下：

  ```js
  function patch (oldVnode, vnode, hydrating, removeOnly) {
      // 新的 VNode 不存在
      if (isUndef(vnode)) {
          // 老的 VNode 存在，执行 Destroy 钩子函数
          if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
          return
      }
  
      let isInitialPatch = false
      // 存储新插入的 VNode 节点
      const insertedVnodeQueue = []
  
      // 老的 VNode 不存在
      if (isUndef(oldVnode)) {
          // empty mount (likely as component), create new root element
          isInitialPatch = true
          // 创建新的 VNode，没有挂载到 DOM 树中
          createElm(vnode, insertedVnodeQueue)
      } else {
          // 新的和老的 VNode 都存在，更新
          const isRealElement = isDef(oldVnode.nodeType)
          // 判断参数1是否是真实 DOM，不是真实 DOM
          if (!isRealElement && sameVnode(oldVnode, vnode)) {
              // 更新操作，Diff 算法
              // patch existing root node
              patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
          } else {
              // 第一个参数是真实 DOM，创建 VNode
              // 初始化
              if (isRealElement) {
                  // mounting to a real element
                  // check if this is server-rendered content and if we can perform
                  // a successful hydration.
                  if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
                      oldVnode.removeAttribute(SSR_ATTR)
                      hydrating = true
                  }
                  if (isTrue(hydrating)) {
                      if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                          invokeInsertHook(vnode, insertedVnodeQueue, true)
                          return oldVnode
                      } else if (process.env.NODE_ENV !== 'production') {
                          warn(
                              'The client-side rendered virtual DOM tree is not matching ' +
                              'server-rendered content. This is likely caused by incorrect ' +
                              'HTML markup, for example nesting block-level elements inside ' +
                              '<p>, or missing <tbody>. Bailing hydration and performing ' +
                              'full client-side render.'
                          )
                      }
                  }
                  // either not server-rendered, or hydration failed.
                  // create an empty node and replace it
                  oldVnode = emptyNodeAt(oldVnode)
              }
  
              // replacing existing element
              const oldElm = oldVnode.elm
              const parentElm = nodeOps.parentNode(oldElm)
  
              // create new node
              // 创建 DOM 节点
              createElm(
                  vnode,
                  insertedVnodeQueue,
                  // extremely rare edge case: do not insert if old element is in a
                  // leaving transition. Only happens when combining transition +
                  // keep-alive + HOCs. (#4590)
                  oldElm._leaveCb ? null : parentElm,
                  nodeOps.nextSibling(oldElm)
              )
  
              // update parent placeholder node element, recursively
              if (isDef(vnode.parent)) {
                  let ancestor = vnode.parent
                  const patchable = isPatchable(vnode)
                  while (ancestor) {
                      for (let i = 0; i < cbs.destroy.length; ++i) {
                          cbs.destroy[i](ancestor)
                      }
                      ancestor.elm = vnode.elm
                      if (patchable) {
                          for (let i = 0; i < cbs.create.length; ++i) {
                              cbs.create[i](emptyNode, ancestor)
                          }
                          // #6513
                          // invoke insert hooks that may have been merged by create hooks.
                          // e.g. for directives that uses the "inserted" hook.
                          const insert = ancestor.data.hook.insert
                          if (insert.merged) {
                              // start at index 1 to avoid re-invoking component mounted hook
                              for (let i = 1; i < insert.fns.length; i++) {
                                  insert.fns[i]()
                              }
                          }
                      } else {
                          registerRef(ancestor)
                      }
                      ancestor = ancestor.parent
                  }
              }
  
              // destroy old node
              if (isDef(parentElm)) {
                  removeVnodes([oldVnode], 0, 0)
              } else if (isDef(oldVnode.tag)) {
                  invokeDestroyHook(oldVnode)
              }
          }
      }
  
      // 触发 insertedVnodeQueue 数组中存放的钩子函数
      invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
      return vnode.elm
  }
  ```

**createElm**

<hr />

* 把 VNode 转换成真实 DOM，插入到 DOM 树上

  ```js
  // 把虚拟 DOM 转换成 真实 DOM，并挂载到真实 DOM 树上
  function createElm (
  vnode,
   insertedVnodeQueue,
   parentElm,
   refElm,
   nested,
   ownerArray, // vnode 中的子节点
   index
  ) {
      if (isDef(vnode.elm) && isDef(ownerArray)) {
          // This vnode was used in a previous render!
          // now it's used as a new node, overwriting its elm would cause
          // potential patch errors down the road when it's used as an insertion
          // reference node. Instead, we clone the node on-demand before creating
          // associated DOM element for it.
          // 克隆 vnode 本身 和 其子节点
          vnode = ownerArray[index] = cloneVNode(vnode)
      }
  
      vnode.isRootInsert = !nested // for transition enter check
      if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
          return
      }
  
      const data = vnode.data
      const children = vnode.children
      const tag = vnode.tag
      // tag 标签名称，判断 vnode 是标签的情况
      if (isDef(tag)) {
          if (process.env.NODE_ENV !== 'production') {
              if (data && data.pre) {
                  creatingElmInVPre++
              }
              // 判断是否是 HTML 中未存在的标签，即自定义标签
              if (isUnknownElement(vnode, creatingElmInVPre)) {
                  warn(
                      'Unknown custom element: <' + tag + '> - did you ' +
                      'register the component correctly? For recursive components, ' +
                      'make sure to provide the "name" option.',
                      vnode.context
                  )
              }
          }
  
          // 判断 vnode 的 ns 属性，即判断是否有命名空间
          vnode.elm = vnode.ns
          // 处理 svg 的情况
              ? nodeOps.createElementNS(vnode.ns, tag)
          // 处理 标签，即创建 DOM 元素
          : nodeOps.createElement(tag, vnode)
          // 为 vnode 所对应的 DOM 元素，设置对应的样式作用域
          setScope(vnode)
  
          /* istanbul ignore if */
          if (__WEEX__) {
              // in Weex, the default insertion order is parent-first.
              // List items can be optimized to use children-first insertion
              // with append="tree".
              const appendAsTree = isDef(data) && isTrue(data.appendAsTree)
              if (!appendAsTree) {
                  if (isDef(data)) {
                      invokeCreateHooks(vnode, insertedVnodeQueue)
                  }
                  insert(parentElm, vnode.elm, refElm)
              }
              createChildren(vnode, children, insertedVnodeQueue)
              if (appendAsTree) {
                  if (isDef(data)) {
                      invokeCreateHooks(vnode, insertedVnodeQueue)
                  }
                  insert(parentElm, vnode.elm, refElm)
              }
          } else {
              // 将 vnode 中所有的子元素，转换为 DOM 对象
              createChildren(vnode, children, insertedVnodeQueue)
              if (isDef(data)) {
                  // 触发 create 钩子函数
                  invokeCreateHooks(vnode, insertedVnodeQueue)
              }
              // 将创建好的 DOM 对象，插入到 parentElm 内
              insert(parentElm, vnode.elm, refElm)
          }
  
          if (process.env.NODE_ENV !== 'production' && data && data.pre) {
              creatingElmInVPre--
          }
      } else if (isTrue(vnode.isComment)) {
          // 判断 vnode 是否是注释节点
          vnode.elm = nodeOps.createComment(vnode.text)
          insert(parentElm, vnode.elm, refElm)
      } else {
          // 判断 vnode 是文本节点
          vnode.elm = nodeOps.createTextNode(vnode.text)
          insert(parentElm, vnode.elm, refElm)
      }
  }
  ```

**patchVnode**

<hr />

* 执行 Diff 算法，进行新旧 VNode 的对比

  ```js
  function patchVnode (
  	oldVnode,
  	vnode,
  	insertedVnodeQueue,
  	ownerArray,
  	index,
  	removeOnly
  ) {
      if (oldVnode === vnode) {
          return
      }
  
      if (isDef(vnode.elm) && isDef(ownerArray)) {
          // clone reused vnode
          vnode = ownerArray[index] = cloneVNode(vnode)
      }
  
      const elm = vnode.elm = oldVnode.elm
  
      ......
  
      let i
      const data = vnode.data
      if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
          i(oldVnode, vnode)
      }
  
      const oldCh = oldVnode.children
      const ch = vnode.children
      if (isDef(data) && isPatchable(vnode)) {
          // 调用 cbs 中的钩子函数，操作节点的属性/样式/事件...
          for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
          // 用户的自定义钩子
          if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
      }
  
      // 新节点没有文本
      if (isUndef(vnode.text)) {
          // 新节点和老节点都有子节点
          // 对子节点进行 diff 操作，调用 updateChildren
          if (isDef(oldCh) && isDef(ch)) {
              if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
          } else if (isDef(ch)) {
              // 新的有子节点，老的没有子节点
              if (process.env.NODE_ENV !== 'production') {
                  checkDuplicateKeys(ch)
              }
              // 先清空老节点 DOM 的文本内容，然后为当前 DOM 节点加入子节点
              if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
              addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
          } else if (isDef(oldCh)) {
              // 老节点有子节点，新节点没有子节点
              // 删除老节点中的子节点
              removeVnodes(oldCh, 0, oldCh.length - 1)
          } else if (isDef(oldVnode.text)) {
              // 老节点有文本，新节点没有文本
              // 清空老节点的文本内容
              nodeOps.setTextContent(elm, '')
          }
      } else if (oldVnode.text !== vnode.text) {
          // 新老节点都有文本节点
          // 修改文本
          nodeOps.setTextContent(elm, vnode.text)
      }
      if (isDef(data)) {
          if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
      }
  }
  ```

**updateChildren**

<hr />

* updateChildren 和 Snabbdom 中的 updateChildren 整体算法一致，这里就不再展开了。我们再来看下它处理过程中 key 的作用，再 patch 函数中，调用 patchVnode 之前，会首先调用 sameVnode()判断当前的新老 VNode 是否是相同节点，sameVnode() 中会首先判断 key 是否相同。

  * 通过下面代码来体会 key 的作用

  ```html
  <div id="app">
      <button @click="handler">按钮</button>
      <ul>
          <li v-for="value in arr" :key="value">{{value}}</li>
      </ul>
  </div>
  <script src="../../dist/vue.js"></script>
  <script>
      const vm = new Vue({
          el: '#app',
          data: {
              arr: ['a', 'b', 'c', 'd']
          },
          methods: {
              handler () {
                  this.arr = ['a', 'x', 'b', 'c', 'd']
              }
          }
      })
  </script>
  ```

  * 当没有设置 key 的时候

    > 在 updateChildren 中比较子节点的时候，会做三次更新 DOM 操作和一次插入 DOM 的操作

  * 当设置 key 的时候

    > 在 updateChildren 中比较子节点的时候，因为 oldVnode 的子节点的 b,c,d 和 newVnode 的 x,b,c 的 key 相同，所以只做比较，没有更新 DOM 的操作，当遍历完毕后，会再把 x 插入到 DOM 上DOM 操作只有一次插入操作。

**总结**

<hr />

![虚拟 DOM 整体过程分析](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\02-min-module\assets\整体过程分析.png)

# 模板编译

* 模板编译的主要目的是将模板 (template) 转换为渲染函数 (render)

  ```html
  <div> 
      <h1 @click="handler">title</h1> 
      <p>some content</p> 
  </div>
  ```

* 渲染函数 render

  ```js
  render (h) { 
      return h('div', [ 
          h('h1', { on: { click: this.handler} }, 'title'), 
          h('p', 'some content') 
      ]) 
  }
  ```

* 模板编译的作用

  * Vue 2.x 使用 VNode 描述视图以及各种交互，用户自己编写 VNode 比较复杂
  * 用户只需要编写类似 HTML 的代码 - Vue 模板，通过编译器将模板转换为返回 VNode 的 render 函数
  * .vue 文件会被 webpack 在构建的过程中转换成 render 函数

**体验模板编译的结果**

* 带编译器版本的 Vue.js 中，使用 template 或 el 的方式设置模板

  ```html
  <div id="app">
      <h1>Vue<span>模板编译过程</span></h1>
      <p>{{ msg }}</p>
      <comp @myclick="handler"></comp>
  </div>
  <script src="../../dist/vue.js"></script>
  <script>
      Vue.component('comp', {
          template: '<div>I am a comp</div>'
      })
      const vm = new Vue({
          el: '#app',
          data: {
              msg: 'Hello compiler'
          },
          methods: {
              handler () {
                  console.log('test')
              }
          }
      })
      console.log(vm.$options.render)
  </script>
  ```

* 编译后 render 输出的结果

  ```js
  (function anonymous() { 
  	with (this) { 
  		return _c( "div", { 
  			attrs: { id: "app" } }, 
  			[ 
  				_m(0), 
  				_v(" "), 
  				_c("p", [_v(_s(msg))]), 
  				_v(" "), 
  				_c("comp", { on: { myclick: handler } }), 
  			],
  			1 
  		); 
  	} 
  });
  ```

*  _c 是 createElement() 方法，定义的位置 instance/render.js 中_

* 相关的渲染函数(_开头的方法定义)，在 instance/render-helps/index.js 中 

  * `src/core/instance/render-helps/index.js `

  ```js
  // 创建文本 Vnode
  target._v = createTextVNode
  // 处理静态内容
  target._m = renderStatic
  ```

  * `src/core/vdom/vnode.js `

  ```js
  export function createTextVNode (val: string | number) {
      return new VNode(undefined, undefined, undefined, String(val))
  }
  ```

  * `src/core/instance/render-helps/render-static.js `

  ```js
  /**
   * Runtime helper for rendering static trees.
   */
  export function renderStatic (
  	index: number,
  	isInFor: boolean
  ): VNode | Array<VNode> {
      const cached = this._staticTrees || (this._staticTrees = [])
      let tree = cached[index]
      // if has already-rendered static tree and not inside v-for,
      // we can reuse the same tree.
      if (tree && !isInFor) {
          return tree
      }
      // otherwise, render a fresh tree.
      tree = cached[index] = this.$options.staticRenderFns[index].call(
          this._renderProxy,
          null,
          this // for render fns generated for functional component templates
      )
      markStatic(tree, `__static__${index}`, false)
      return tree
  }
  ```

* 把 template 转换成 render 的入口 src\platforms\web\entry-runtime-with-compiler.js

**Vue Template Explorer**

*  [vue-template-explorer](https://template-explorer.vuejs.org/#%3Cdiv%20id%3D%22app%22%3E%0A%20%20%3Cselect%3E%0A%20%20%20%20%3Coption%3E%0A%20%20%20%20%20%20%7B%7B%20msg%20%20%7D%7D%0A%20%20%20%20%3C%2Foption%3E%0A%20%20%3C%2Fselect%3E%0A%20%20%3Cdiv%3E%0A%20%20%20%20hello%0A%20%20%3C%2Fdiv%3E%0A%3C%2Fdiv%3E)
  * Vue 2.6 把模板编译成 render 函数的工具
*  [vue-next-template-explorer](https://vue-next-template-explorer.netlify.app/#%7B%22src%22%3A%22%3Cdiv%20id%3D%5C%22app%5C%22%3E%5Cn%20%20%3Cselect%3E%5Cn%20%20%20%20%3Coption%3E%5Cn%20%20%20%20%20%20%7B%7B%20msg%20%20%7D%7D%5Cn%20%20%20%20%3C%2Foption%3E%5Cn%20%20%3C%2Fselect%3E%5Cn%20%20%3Cdiv%3E%5Cn%20%20%20%20hello%5Cn%20%20%3C%2Fdiv%3E%5Cn%3C%2Fdiv%3E%22%2C%22options%22%3A%7B%22mode%22%3A%22module%22%2C%22prefixIdentifiers%22%3Afalse%2C%22optimizeImports%22%3Afalse%2C%22hoistStatic%22%3Afalse%2C%22cacheHandlers%22%3Afalse%2C%22scopeId%22%3Anull%2C%22inline%22%3Afalse%2C%22ssrCssVars%22%3A%22%7B%20color%20%7D%22%2C%22bindingMetadata%22%3A%7B%22TestComponent%22%3A%22setup-const%22%2C%22setupRef%22%3A%22setup-ref%22%2C%22setupConst%22%3A%22setup-const%22%2C%22setupLet%22%3A%22setup-let%22%2C%22setupMaybeRef%22%3A%22setup-maybe-ref%22%2C%22setupProp%22%3A%22props%22%2C%22vMySetupDir%22%3A%22setup-const%22%7D%2C%22optimizeBindings%22%3Afalse%7D%7D)
  * Vue 3.0 beta 把模板编译成 render 函数的工具

**模板编译过程**

<hr />

* 解析、优化、生成

**编译的入口**

* `src\platforms\web\entry-runtime-with-compiler.js`

  ```js
  Vue.prototype.$mount = function (
  	// el: 创建 vue 实例时，传入的选项
  	el?: string | Element,
   	// 非 SSR 情况下为 false，SSR 时为 true
   	hydrating?: boolean
  ): Component {
  	......
      // 把 template 转换成 render 函数
      const { render, staticRenderFns } = compileToFunctions(template, {
          outputSourceRange: process.env.NODE_ENV !== 'production',
          shouldDecodeNewlines,
          shouldDecodeNewlinesForHref,
          delimiters: options.delimiters,
          comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns
  	......
  }
  ```

* 调试 compileToFunctions() 执行过程，生成渲染函数的过程

  * `compileToFunctions: src\compiler\to-function.js`
  * `complie(template, options)：src\compiler\create-compiler.js`
  * `baseCompile(template.trim(), fifinalOptions)：src\compiler\index.js`

  ![模板编译入口](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\02-min-module\assets\模板编译入口.png)

**解析** **- parse**

* 解析器将模板解析为抽象语树 AST，只有将模板解析成 AST 后，才能基于它做优化或者生成代码字符串。

  * `src/compiler/index.js`

  ```js
  // 把模板转换成 ast ，即 抽象语法树
  // 抽象语法树，用来以树形的方式描述代码结构
  const ast = parse(template.trim(), options)
  ```

  * `src/compiler/parser/index.js `

  ```js
  parse()
  ```

* 查看得到的 AST tree

  [astexplorer](https://astexplorer.net/#/gist/30f2bd28c9bbe0d37c2408e87cabdfcc/1cd0d49beed22d3fc8e2ade0177bb22bbe4b907c)

* 结构化指令的处理

  * v-if 最终生成单元表达式
  * `src/compiler/parser/index.js`

  ```js
  // structural directives
  // 结构化的指令
  // v-for
  processFor(element)
  processIf(element)
  processOnce(element)
  ```

  * `src/compiler/codegen/index.js `

  ```js
  export function genIf (
  	el: any,
  	state: CodegenState,
  	altGen?: Function,
  	altEmpty?: string
  ): string {
      el.ifProcessed = true // avoid recursion
      return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
  }
  // 最终调用 genIfConditions 生成三元表达式
  ```

* v-if 最终编译的结果

  ```js
  ƒ anonymous( 
  ) {
      with(this){ 
          return _c('div',{attrs:{"id":"app"}},[ 
              _m(0), 
              _v(" "), 
              (msg)?_c('p',[_v(_s(msg))]):_e(),_v(" "), 
              _c('comp',{on:{"myclick":onMyClick}}) 
          ],1) 
      } 
  }
  ```

> v-if/v-for 结构化指令只能在编译阶段处理，如果我们要在 render 函数处理条件或循环只能使用js 中的 if 和 for

* 注册全局组件，示例如下：

  ```js
  Vue.component('comp', { 
  	data: () { 
      	return { 
      		msg: 'my comp' 
  		} 
  	},
  	render (h) { 
      	if (this.msg) { 
              return h('div', this.msg) 
          }
      	return h('div', 'bar') 
  	} 
  })
  ```

**优化** **- optimize**

* 优化抽象语法树，检测子节点中是否是纯静态节点

* 一旦检测到纯静态节点，例如：

  **hello整体是静态节点**

  <hr />

  永远不会更改的节点

  * 提升为常量，重新渲染的时候不在重新创建节点
  * 在 patch 的时候直接跳过静态子树
  * `src/compiler/index.js `

  ```js
  if (options.optimize !== false) {
      // 优化抽象语法树
      optimize(ast, options)
  }
  ```

  * `src/compiler/optimizer.js`

  ```js
  /**
   * Goal of the optimizer: walk the generated template AST tree
   * and detect sub-trees that are purely static, i.e. parts of
   * the DOM that never needs to change.
   *
   * Once we detect these sub-trees, we can:
   *
   * 1. Hoist them into constants, so that we no longer need to
   *    create fresh nodes for them on each re-render;
   * 2. Completely skip them in the patching process.
   */
  export function optimize (root: ?ASTElement, options: CompilerOptions) {
      if (!root) return
      isStaticKey = genStaticKeysCached(options.staticKeys || '')
      isPlatformReservedTag = options.isReservedTag || no
      // first pass: mark all non-static nodes.
      // 标记静态节点
      markStatic(root)
      // second pass: mark static roots.
      // 标记静态根节点，指的是 标签中包括子标签，并且没有动态内容，即纯文本内容
      markStaticRoots(root, false)
  }
  ```

**生成** **- generate**

* 把优化后的 AST 转换成字符串形式的代码

  * `src/compiler/index.js `

  ```js
  const code = generate(ast, options)
  ```

  * `src/compiler/codegen/index.js `

  ```js
  export function generate (
  	ast: ASTElement | void,
  	options: CompilerOptions
  ): CodegenResult {
      // 创建代码生成过程中使用的状态对象
      const state = new CodegenState(options)
      const code = ast ? genElement(ast, state) : '_c("div")'
      return {
          // 对应 AST 对象生成的 VNode 代码的字符串形式
          render: `with(this){return ${code}}`,
          staticRenderFns: state.staticRenderFns
      }
  }
  ```

  * `src/compiler/to-function.js`

  ```js
  // 把字符串转换成函数
  function createFunction (code, errors) {
      try {
          return new Function(code)
      } catch (err) {
          errors.push({ err, code })
          return noop
      }
  }
  ```

**总结**

* **编译的过程**

  ![模板编译过程](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\02-min-module\assets\模板编译过程.png)

# 组件化机制

<hr />

* 组件化可以让我们方便的把页面拆分成多个可重用的组件
* 组件是独立的，系统内可重用，组件之间可以嵌套
* 有了组件可以像搭积木一样开发网页
* 下面我们将从源码的角度来分析 Vue 组件内部如何工作
  * 组件实例的创建过程是从上而下
  * 组件实例的挂载过程是从下而上

**组件声明**

* 复习全局组件的定义方式

  ```js
  Vue.component('comp', { 
      template: '<h1>hello</h1>' 
  })
  ```

* Vue.component() 入口

  * 创建组件的构造函数，挂载到 Vue 实例的 vm.options.component.componentName = Ctor
  * `src/core/global-api/index.js `

  ```js
  // 注册 Vue.directive()、 Vue.component()、Vue.filter() 
  initAssetRegisters(Vue)
  ```

  * `src/core/global-api/assets.js`

  ```js
  if (type === 'component' && isPlainObject(definition)) { 
      definition.name = definition.name || id 
      definition = this.options._base.extend(definition) 
  }
  ……
  // 全局注册，存储资源并赋值 
  // this.options['components']['comp'] = Ctor 
  this.options[type + 's'][id] = definition
  ```

  * `src/core/global-api/index.js`

  ```js
  // this is used to identify the "base" constructor to extend all plain- object // components with in Weex's multi-instance scenarios. 
  Vue.options._base = Vue 
  ```

  * `src\core\global-api\extend.js`

  ```js
  Vue.extend()
  ```

  * 组件构造函数的创建

  ```js
  Vue.extend = function (extendOptions: Object): Function {
      ......
  	// 创建组件构造函数
      const Sub = function VueComponent (options) {
          // 调用 _init() 初始化
          this._init(options)
      }
  
      // 原型继承自 Vue
      Sub.prototype = Object.create(Super.prototype)
      Sub.prototype.constructor = Sub
      Sub.cid = cid++
      // 合并 options
      Sub.options = mergeOptions(
          Super.options,
          extendOptions
      )
      Sub['super'] = Super
  
      // For props and computed properties, we define the proxy getters on
      // the Vue instances at extension time, on the extended prototype. This
      // avoids Object.defineProperty calls for each instance created.
      if (Sub.options.props) {
          initProps(Sub)
      }
      if (Sub.options.computed) {
          initComputed(Sub)
      }
  
      // allow further extension/mixin/plugin usage
      Sub.extend = Super.extend
      Sub.mixin = Super.mixin
      Sub.use = Super.use
  
      // create asset registers, so extended classes
      // can have their private assets too.
      ASSET_TYPES.forEach(function (type) {
          Sub[type] = Super[type]
      })
      // enable recursive self-lookup
      // 把组件构造函数保存到 Ctor.options.components.comp = Ctor
      if (name) {
          Sub.options.components[name] = Sub
      }
      ......
  }
  ```

  * 调试 Vue.component() 调用的过程

  ```html
  <div id="app"> 
  </div> 
  <script src="../../dist/vue.js"></script> 
  <script> 
      const Comp = Vue.component('comp', { 
          template: '<h2>I am a comp</h2>' 
      })
      const vm = new Vue({ 
          el: '#app', 
          render (h) { 
              return h(Comp) 
          } 
      }) 
  </script>
  ```

**组件创建和挂载**

<hr />

**组件** **VNode** **的创建过程**

* 创建根组件，首次 _render() 时，会得到整棵树的 VNode 结构_

* _整体流程：new Vue() --> $mount() --> vm._render() --> createElement() --> createComponent()

* 创建组件的 VNode，初始化组件的 hook 钩子函数

  * `src/core/vdom/create-element.js `

  ```js
  // 1. _createElement() 中调用 createComponent()
  else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // 查找自定义组件构造函数的声明
      // 根据 Ctor 创建组件的 VNode
      // component
      vnode = createComponent(Ctor, data, context, children, tag)
  } 
  ```

  * `src/core/vdom/create-component.js `

  ```js
  // 2. createComponent() 中调用创建自定义组件对应的 VNode
  export function createComponent (
  	Ctor: Class<Component> | Function | Object | void,
  	data: ?VNodeData,
  	context: Component,
  	children: ?Array<VNode>,
  	tag?: string
  ): VNode | Array<VNode> | void {
      if (isUndef(Ctor)) {
          return
      }
  
      ......
  
      // install component management hooks onto the placeholder node
      // 安装组件的钩子函数 init/prepath/insert/destory
      // 准备好了 data.hook 中的钩子函数
      installComponentHooks(data)
  
      // return a placeholder vnode
      const name = Ctor.options.name || tag
      // 创建自定义组件的 VNode，设置自定义组件的名字
      // 记录 this.componentOptions = componentOptions
      const vnode = new VNode(
          `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
          data, undefined, undefined, undefined, context,
          { Ctor, propsData, listeners, tag, children },
          asyncFactory
      )
  
      // Weex specific: invoke recycle-list optimized @render function for
      // extracting cell-slot template.
      // https://github.com/Hanks10100/weex-native-directive/tree/master/component
      /* istanbul ignore if */
      if (__WEEX__ && isRecyclableComponent(vnode)) {
          return renderRecyclableComponentTemplate(vnode)
      }
  
      return vnode
  }
  ```

  ```js
  // 3. installComponentHooks() 初始化组件的 data.hook
  function installComponentHooks (data: VNodeData) {
      const hooks = data.hook || (data.hook = {})
      // 用户可以传递自定义钩子函数
      // 把用户传入的自定义钩子函数和 componentVNodeHooks 中预定义的钩子函数合并 
      for (let i = 0; i < hooksToMerge.length; i++) {
          const key = hooksToMerge[i]
          const existing = hooks[key]
          const toMerge = componentVNodeHooks[key]
          if (existing !== toMerge && !(existing && existing._merged)) {
              hooks[key] = existing ? mergeHook(toMerge, existing) : toMerge
          }
      }
  }
  ```

  ```js
  // 4. 钩子函数定义的位置（init()钩子中创建组件的实例）
  // inline hooks to be invoked on component VNodes during patch
  const componentVNodeHooks = {
      init (vnode: VNodeWithData, hydrating: boolean): ?boolean {
      if (
          vnode.componentInstance &&
          !vnode.componentInstance._isDestroyed &&
          vnode.data.keepAlive
          ) {
              // kept-alive components, treat as a patch
              const mountedNode: any = vnode // work around flow
              componentVNodeHooks.prepatch(mountedNode, mountedNode)
          } else {
              const child = vnode.componentInstance = createComponentInstanceForVnode(
                  vnode,
                  // 当前组件对象的父组件对象
                  activeInstance 
              )
              child.$mount(hydrating ? vnode.elm : undefined, hydrating)
          }
      },
  
      prepatch (oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {
          ......
      },
  
  	insert (vnode: MountedComponentVNode) {
  		......
  	},
  
  	destroy (vnode: MountedComponentVNode) {
  		......
  	}
  }
  ```

  ```js
  // 5 .创建组件实例的位置，由自定义组件的 init() 钩子方法调用
  export function createComponentInstanceForVnode (
  	// we know it's MountedComponentVNode but flow doesn't
  	vnode: any,
  	// activeInstance in lifecycle state
  	parent: any
  ): Component {
      const options: InternalComponentOptions = {
          _isComponent: true, // 当前是组件
          _parentVnode: vnode, // 当前创建好的 VNode 对象，用来占位
          parent               // 当前组件对象的父组件对象
      }
      // check inline-template render functions
      // 获取 inline-template
      // <comp inline-template> xxxx </comp>
      const inlineTemplate = vnode.data.inlineTemplate
      if (isDef(inlineTemplate)) {
          options.render = inlineTemplate.render
          options.staticRenderFns = inlineTemplate.staticRenderFns
      }
      // 创建组件实例
      return new vnode.componentOptions.Ctor(options)
  }
  ```

* 调试执行过程

**组件实例的创建和挂载过程**

* Vue._update() --> patch() --> createElm() --> createComponent()

  * `src/core/vdom/patch.js`

  ```js
  // 1. 创建组件实例，挂载到真实 DOM
  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
      let i = vnode.data
      if (isDef(i)) {
          const isReactivated = isDef(vnode.componentInstance) && i.keepAlive
          if (isDef(i = i.hook) && isDef(i = i.init)) {
              // 调用 init() 方法，创建和挂载组件实例
              // init() 的过程中，创建好了组件的真实 DOM，挂载到了 vnode.elm 上
              i(vnode, false /* hydrating */)
          }
          // after calling the init hook, if the vnode is a child component
          // it should've created a child instance and mounted it. the child
          // component also has set the placeholder vnode's elm.
          // in that case we can just return the element and be done.
          if (isDef(vnode.componentInstance)) {
              // 调用钩子函数（VNode的钩子函数初始化属性/事件/样式等，组件的钩子函数）
              initComponent(vnode, insertedVnodeQueue)
              // 把组件对应的 DOM 插入到父元素中
              insert(parentElm, vnode.elm, refElm)
              if (isTrue(isReactivated)) {
                  reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
              }
              return true
          }
      }
  }
  ```

  ```js
  // 2. 调用钩子函数，设置局部作用于样式
  function initComponent (vnode, insertedVnodeQueue) {
      if (isDef(vnode.data.pendingInsert)) {
          insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert)
          vnode.data.pendingInsert = null
      }
      vnode.elm = vnode.componentInstance.$el
      if (isPatchable(vnode)) {
          invokeCreateHooks(vnode, insertedVnodeQueue)
          setScope(vnode)
      } else {
          // empty component root.
          // skip all element-related modules except for ref (#3455)
          registerRef(vnode)
          // make sure to invoke the insert hook
          insertedVnodeQueue.push(vnode)
      }
  }
  ```

  ```js
  // 3. 调用钩子函数
  function invokeCreateHooks (vnode, insertedVnodeQueue) {
      // 调用 VNode 的钩子函数
      for (let i = 0; i < cbs.create.length; ++i) {
          cbs.create[i](emptyNode, vnode)
      }
      i = vnode.data.hook // Reuse variable
      // 调用组件的钩子函数
      if (isDef(i)) {
          if (isDef(i.create)) i.create(emptyNode, vnode)
          if (isDef(i.insert)) insertedVnodeQueue.push(vnode)
      }
  }
  ```

  

