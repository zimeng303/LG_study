@[TOC](Vue)

# Vue 基础

## 基础结构

混入 mixin ：复用组件的选项

# Vue-Router

## 基础知识

### 编程式导航

this.$router.replace()

this.$router.push()

this.$router.go()

### Hash 和 History 

客户端路由的实现模式，当路径发生变化时，不会向服务器发生请求，都是 JavaScript 监视路径的变化，然后根据不同的地址渲染不同的内容。

**表现形式的区别**

* Hash 模式

  https://music.163.com/#/playlist?id=3102961863

* History 模式

  https://music.163.com/playlist/3102961863

  需要服务端配置支持

**原理的区别**

* Hash 模式是基于锚点，以及 onhashchange 事件

  通过 锚点的值 作为路由地址，当地址发生变化后，触发 onhashchange 事件。

  即 根据路径决定页面中呈现的内容。

* History 模式是基于 HTML5中的 History API

  **history.pushState()**   IE10 以后才支持

  当调用 history.push() 时，路径会发生变化，要向服务器发生请求；

  当调用 history.pushState() 时，不会向服务器发生请求，只会改变浏览器路径栏中的地址，并且将地址记录到历史记录中。也就是说，可以使用 pushState() 实现客户端路由。但是，需要在 `IE10` 以后使用。

  history.replaceState()

**History 模式**

* History 需要服务器的支持
* 单页应用中，服务端不存在 http://www.testurl.com/login 这样的地址，会返回找不到该页面
* 在服务端应该除了静态资源外都返回单页应用的 index.html

**1. Node** 

**2. nginx** 

* 从官网下载 nginx 的压缩包

* 把压缩包解压到 c 盘根目录，c:\nginx-1.18.0 文件夹

  注意：目录不能有中文

* 打开命令行，切换到目录 c:\nginx-1.18.0 

* 启动 nginx

  ```powershell
  $ start nginx
  ```

* 重启

  ```powershell
  $ nginx -s reload
  ```

* 停止

  ```powershell
  $ nginx -s stop
  ```

**总结**

**Hash 模式**

* URL 中 # 后面的内容作为路径地址
* 监听 hashchange 事件
* 根据当前路由地址找到对应组件重新渲染

**History 模式**

* 通过 history.pushState() 方法改变地址栏
* 监听 popstate 事件
* 根据当前路由地址找到对应组件重新渲染

## 模拟实现

### 前置知识

* 插件
* 混入
* Vue.observable()：创建响应式对象，创建出的对象可以直接用在渲染函数或者计算属性上面。
* 插槽
* render 函数
* 运行时和完整版的 Vue

### 实现原理

注：网上搜索

### 源码分析

#### install()

install() 方法是 VueRouter 类中的静态方法，当使用 Vue.use(fun | obj) 注册插件时，会调用 install() 方法。

* install() 源码，分析如下：

  ```js
  let _Vue = null
  
  export default class VueRouter {
      /**
       * Vue.use() 注册插件时，调用
       * @param Vue Vue构造函数
       */
      static install(Vue) {
          // 1，判断当前插件是否已经被安装
          if (VueRouter.install.installed) {
              return
          }
          VueRouter.install.installed = true
          // 2，把Vue构造函数记录到全局变量中
          _Vue = Vue
          // 3，把创建Vue实例时，传入的 router对象 注入到Vue实例上
  
          // 混入
          _Vue.mixin({
              beforeCreate() {
                  // 判断当前传入的是否是 router 对象，即排除传入组件的情况
                  if (this.$options.router) {
                      _Vue.prototype.$router = this.$options.router
                  }
              }
          })
      }
  }
  ```

#### Constructor()

VueRouter 类的构造函数，接收一个 Options 选项，它的的返回值是一个 VueRouter 对象。在构造函数中，需要初始化三个属性：1，options，记录构造函数中传入的对象(路由规则)；2，data，存储当前的路由地址，当路由变化时，需要加载对应的组件，因此，需要设置成一个响应式的对象；3，routeMap，是一个对象，用来记录路由地址和组件的对应关系，将来会把路由规则解析到 routeMap 中。

* constructor() 源码，分析如下：

  ```js
  let _Vue = null
  
  export default class VueRouter {    
      // 构造函数
      constructor (options) {
          // 记录构造函数中传入的选项
          this.options = options
          // 当options中传入的 routes(路由规则) 解析出来以后，会将其存储到 routeMap 对象中，以便在router-view组件中，可以根据路由地址在routeMap中找到对应的组件，并将其渲染到浏览器中
          // 键：路由地址 值：地址所对应的路由组件
          this.routeMap = {}
          // 响应式对象，使用 Vue.observable() 创建
          this.data = _Vue.observable({
              current: '/' // 记录当前的路由地址，默认 '/'
          })
      }
  }
  ```

#### createRouteMap()

createRouteMap()，会把构造函数中选项的 routes(路由规则)，转换成键值对的形式，存储到 routeMap对象中。

* createRouteMap() 源码，分析如下：

  ```js
  export default class VueRouter {
      // 其余代码 省略
      createRouteMap () {
          // 遍历所有的路由规则，把路由规则解析成键值对的形式，存储到 routeMap 中
          this.options.routes.forEach(route => {
              this.routeMap[route.path] = route.component
          })
      }
  }
  ```

#### initComponents()

initComponents() ，创建 router-link 和 router-view 组件。

* initComponents() 源码，注册 router-link 组件，分析如下：

  ```js
  export default class VueRouter {
      // 创建 router-link 和 router-view 组件
      // 传入Vue构造函数
      // 不使用_Vue，减少与外部的依赖
      initComponents (Vue) {
          Vue.component('router-link', {
              props: {
                  to: String
              },
              // 使用插槽，进行中间内容的填充
              template: '<a :href="to"><slot></slot></a>'
          })
      }
  }
  ```

  运行结果，如下图所示：

  ![image-20201208102338402](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\01-min-module\images\image-20201208102338402.png)

  可以看到，运行时报错，这是因为 运行版Vue ，不支持 template 模板，需要打包的时候提前编译。

* 使用 render 函数，解决上述问题，代码如下：

  ```js
  export default class VueRouter {
      initComponents (Vue) {
          Vue.component('router-link', {
              props: {
                  to: String
              },
              // h 函数，创建虚拟 DOM 
              render (h) {
                  /**
                   * @param 创建元素对应的选择器
                   * @param 添加标签属性，对象
                   * @param 生成标签的子元素，数组
                   */
                  return h('a', {
                      attrs: {
                          href: this.to
                      }
                  }, [this.$slots.default]) // 获取默认插槽 
              }
          })
      }
  }
  ```

* 注册 router-view 组件，代码如下：

  ```js
  export default class VueRouter {
      // 其余代码 省略
      initComponents (Vue) {
          Vue.component('router-link', {
              props: {
                  to: String
              },
              // h 函数，创建虚拟 DOM 
              render (h) {
                  return h('a', {
                      attrs: {
                          href: this.to,
                          on: {
                              click: this.clickHandler // 注册点击事件
                          }
                      }
                  }, [this.$slots.default]) // 获取默认插槽 
              },
              methods: {
                  clickHandler (e) {
                  // 改变浏览器的地址栏，但不向服务器发送请求，只在客户端进行操作
                  /**
                   * @param data 触发popstate事件，传给 popstate 的事件对象
                   * @param title 网页的标题
                   * @param url?  地址
                   */
                      history.pushState({}, '', this.to)
                      // 将当前的路径记录到 data.current 中
                      // 响应式对象，当值改变时，自动加载对应的组件，进行渲染视图
                      this.$router.data.current = this.to   
                      e.preventDefault() // 阻止默认事件
                  }
              }
          })
  
          const self = this
          Vue.component('router-view', {
              // h 函数，可以直接把一个组件转换成 虚拟 DOM
              render (h) {
                  // 通过当前路由地址，在routeMap中找到对应组件
                  const component = self.routeMap[self.data.current] 
                  return h(component)
              }
          })
      }
  }
  ```

#### initEvent()

initEvent()，注册 popstate 事件，当历史发生变化时，进行触发。即点击浏览器的前进后退按钮时，触发 popstate 事件。

* initEvent() ，注册 popstate 事件，代码如下：

  ```js
  export default class VueRouter {
      initEvent () {
          window.addEventListener('popstate', () => {
              this.data.current = window.location.pathname
          })
      }
  }
  ```

#### init()

init() ，用来初始化调用其他函数。

* init() 源码，，代码如下：

  ```js
  export default class VueRouter {
      // 其余代码省略
      static install (Vue) {
          _Vue.mixin({
              beforeCreate () {
                  if (this.$options.router) {
                      _Vue.prototype.$router = this.$options.router
                      this.$options.router.init()
                  }
              }
          })
      }
  
      init () {
          this.createRouteMap()
          this.initComponents(_Vue)
          this.initEvent()
      }
  }
  ```

## 构建版本

**运行版 Vue**

不支持 template 模板，需要打包的时候提前编译。

* 使用 render 函数，替代 template 模板，代码如下

  ```js
  export default class VueRouter {
      initComponents (Vue) {
          Vue.component('router-link', {
              props: {
                  to: String
              },
              // h 函数，创建虚拟 DOM 
              render (h) {
                  return h() 
              }
          })
      }
  }
  ```

**完整版 Vue**

包含运行时和编译器，体积比运行时版大 10K 左右，程序运行的时候把模板转换成 render 函数。

* 在 vue.config.js 中，开启使用包含运行时编译器的Vue核心版本，代码如下：

  ```js
  module.exports = {
      runtimeCompiler: true // 默认 false
  }
  ```

# 响应式原理

## 课程目标

模拟 Vue 响应式原理。

## 准备工作

**数据驱动**

* 数据响应式

  数据模型仅仅是普通的 JavaScript 对象，而当我们修改数据时，视图会进行更新，避免了繁琐的 DOM 操作，提高开发效率。

* 双向绑定

  1. 数据改变，视图改变；视图改变，数据也随之改变
  2. 我们可以使用 v-model 在表单元素上创建双向数据绑定

* 数据驱动（Vue 最独特的特性之一）

  开发过程中仅需要关注数据本身，不需要关心数据是如何渲染到视图

**响应式的核心原理**

* Vue 2.x -- 基于 Object.defineProperty 实现
  1. [[Vue 2.x 深入响应式原理]](https://cn.vuejs.org/v2/guide/reactivity.html)
  2. [MDN - Object.defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
  3. 浏览器兼容 IE8 以上（不兼容 IE8）

* Vue 3.x -- 基于 Proxy 实现
  1. [MDN - Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
  2. 直接监听对象，而非属性
  3. ES 6中新增，IE 不支持，性能由浏览器优化

**发布订阅模式和观察者模式**

发布订阅模式和观察者模式，是两种设计模式，在 Vue 中有各自的应用场景，本质相同，但存在一定的区别。

**1，发布/订阅模式**

* 发布/订阅模式

  1. 订阅者
  2. 发布者
  3. 信号中心

  > 我们假定，存在一个“信号中心”，某个任务执行完成，就向信号中心“发布”（publish）一个信号，其他任务可以向信号中心“订阅”（subscribe）这个信号，从而知道什么时候自己可以开始执行，这就叫做**“发布/订阅模式”（publish-subscribe pattern）**``

* Vue 的自定义事件

  [https://cn.vuejs.org/v2/guide/migration.html#dispatch-%E5%92%8C-broadcast-%E6%9B%BF%E6%8D%A2](https://cn.vuejs.org/v2/guide/migration.html#dispatch-%E5%92%8C-broadcast-%E6%9B%BF%E6%8D%A2)

  ```js
  let vm = new Vue()
  // $on 注册事件，同一个事件可以注册多个事件处理函数
  // 第一个参数：事件名称；第二个参数：事件处理函数
  vm.$on('dataChange', () => {
  })
  vm.$on('dataChange', () => {
  })
  vm.$emit('dataChange') // $emit 触发事件
  ```

* 兄弟组件通信过程

  <font color="#999999"> eventBus.js</font>

  ```js
  // 事件中心
  let eventHub = new Vue()
  ```

  <font color="#999999">ComponentA.vue</font>

  ```js
  // 发布者
  addTodo: function () {
      // 发布消息（触发事件）
      eventHub.$emit('add-todo', { text: this.newTodoText })
      this.newTodoText = ''
  }
  ```

  <font color="#999999">ComponentB.vue</font>

  ```js
  // 订阅者
  created: function () {
      // 订阅消息（注册事件）
      eventHub.$on('add-todo', this.addTodo)
  }
  ```

* 模拟 Vue 自定义事件的实现

  ```js
  // 事件触发器
  class EventEmitter {
      constructor () {
          // 定义对象，用来存储 事件和事件处理函数
          // 属性名：事件名称
          // 属性值：事件处理函数 数组
          // { 'click': [fn1, fn2], 'change': [fn] }
          this.subs = Object.create(null) // 参数，设置对象的原型
      }
  
      // 注册事件
      $on (eventType, handler) {
          this.subs[eventType] = this.subs[eventType] || []
          this.subs[eventType].push(handler)
      }
  
      // 触发事件
      $emit (eventType) {
          if (this.subs[eventType]) {
              this.subs[eventType].forEach(handler => {
                  handler()
              });
          }
      }
  }
  
  // 测试
  let em = new EventEmitter()
  em.$on('click', () => {
      console.log('click1');
  })
  em.$on('click', () => {
      console.log('click2');
  })
  em.$emit('click')
  ```

**2，观察者模式**

* 观察者(订阅者) -- Watcher

  update()：当事件发生时，具体要做的事情

* 目标(发布者) -- Dep

  1. subs 数组：存储所有的观察者
  2. addSub()：添加观察者

  3. notify()：当事件发生，调用所有观察者的 update() 方法

* 没有事件发生

  ```js
  // 发布者 - 目标
  class Dep {
      constructor () {
          // 记录所有的订阅者
          this.subs = []
      }
  
      // 把订阅者添加到 subs 中
      addSubs (sub) {
          if (sub && sub.update) {
              this.subs.push(sub)
          } 
      }
  
      // 当事件发生，通知所有的订阅者，调用所有观察者的 update() 方法
      notify () {
          this.subs.forEach(sub => {
              sub.update()
          }) 
      }
  }
  
  // 订阅者 - 观察者
  class Watcher {
      // 当事件发生，由发布者调用所有观察者的 update() 方法
      update () { 
          // 实现更新视图等功能
          console.log('update');
      }
  }
  
  // 测试
  let dep = new Dep()
  let watcher = new Watcher()
  
  dep.addSubs(watcher)
  dep.notify()
  ```

**总结**

* **观察者模式**是由具体目标调度，比如当事件触发，Dep 就会去调用观察者的方法，所以观察者模式的订阅者与发布者之间是存在依赖的

* **发布/订阅模式**由统一调度中心调用，因此发布者和订阅者不需要知道对方的存在。

  ![image-20201208173549264](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\01-min-module\images\image-20201208173549264.png)

## 整体分析

1. Vue 基本结构

2. 打印 Vue 实现观察

3. 整体结构

   ![image-20201209090514597](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\01-min-module\images\image-20201209090514597.png)

### Vue

把 data 中的成员注入到 Vue 实例，并且把 data 中的成员转成 getter / setter。

**功能**

* 负责接收初始化的参数(选项)
* 负责把 data 中的属性注入到 Vue 实例，转换成 getter / setter
* 负责调用 observer 监听 data 中所有属性的变化
* 负责调用 compiler 解析指令/插值表达式

**结构**

* 类图

  ![image-20201209100508997](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\01-min-module\images\image-20201209100508997.png)

* 具体实现，代码如下：

  ```js
  class Vue {
      constructor (options) {
          // 1. 通过属性保存选项的数据
          this.$options = options || {}
          this.$data = options.data || {}
          this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
          // 2. 把data中的成员转换成 getter 和 setter，注入到 Vue 实例中
          this._proxyData(this.$data)
          // 3. 调用observer对象，监听数据的变化
          new Observer(this.$data)
          // 4. 调用compiler对象，解析指令和差值表达式
          new Compiler(this)
      }
  
      // 约定 _ 开头，为私有属性
      // 代理数据，即让 Vue 代理data中的属性
      _proxyData (data) {
          // 遍历data中的所有属性
          Object.keys(data).forEach(key => {
              // 把data的属性注入到vue实例中
              Object.defineProperty(this, key, {
                  enumerable: true,
                  configurable: true,
                  get () {
                      return data[key]
                  },
                  set (newValue) {
                      if (data[key] === newValue) {
                          return
                      }
                      data[key] = newValue 
                  }
              })
          })
      }
  }
  ```

### Observer

能够对数据对象的所有属性进行监听，如有变动可拿到最新值并通知 Dep。

**功能**

* 负责把 data 选项中的属性转换成响应式数据
* data 中的某个属性也是对象，把该属性转换成响应式数据
* 数据变化发送通知

**结构**

* 类图

  ![image-20201209101331521](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\01-min-module\images\image-20201209101331521.png)

* 具体实现，代码如下：

  ```js
  class Observer {
      constructor (data) {
          this.walk(data)
      }
  
      walk (data) {
          // 1. 判断 data 是否是对象
          if (!data || typeof data !== 'object') {
              return
          }
          // 2. 遍历data对象的所有属性
          Object.keys(data).forEach(key => {
              this.defineReactive(data, key, data[key])
          })
      }
  
      // 调用 Object.defineProperty() 将属性转换为 getter / setter
      defineReactive (obj, key, val) {
          const that = this
          // 负责收集依赖，并发送通知
          const dep = new Dep()
          // 如果val是对象，把val内部的属性转换成响应式数据
          this.walk(val)
          Object.defineProperty(obj, key, {
              enumerable: true,
              configurable: true,
              get () {
                  // 收集依赖
                  Dep.target && dep.addSub(Dep.target)
                  // 此处不可以写成 obj[key]，否则会发生死递归
                  // 这里使用闭包，扩展了val变量的作用域
                  return val
              },
              set (newValue) { // function，改变this
                  if (newValue === val) {
                      return
                  }
                  val = newValue
                  // 如果newValue是对象，把newValue内部的属性转换成响应式数据
                  that.walk(newValue)
                  // 发送通知
                  dep.notify()
              }
          })
      }
  }
  ```

### Compiler

解析每个元素中的指令/插值表达式，并替换成相应的数据。

**功能**

* 负责编译模板，解析指令 / 差值表达式
* 负责页面的首次渲染
* 当数据变化后重新渲染视图

**结构**

* 类图

  ![image-20201209104235492](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\01-min-module\images\image-20201209104235492.png)

* 具体实现，代码如下：

  ```js
  class Compiler {
      constructor(vm) {
          this.el = vm.$el // 记录模板
          this.vm = vm     // 记录 Vue 实例
          this.compile(this.el)
      }
  
      // 编译模板，处理文本节点（差值表达式）和元素节点（指令）
      compile(el) {
          let childNodes = el.childNodes // 伪数组
          // 将伪数组转换成数组
          Array.from(childNodes).forEach(node => {
              if (this.isTextNode(node)) {
                  // 处理文本节点
                  this.compileText(node)
              } else if (this.isElementNode(node)) {
                  // 处理元素节点
                  this.compileElement(node)
              }
  
              // 判断node节点，是否有子节点，如果有子节点，要递归调用 compile
              if (node.childNodes && node.childNodes.length) {
                  this.compile(node)
              }
          })
      }
  
      // 编译元素节点，处理指令
      compileElement(node) {
          // 遍历所有的属性节点
          Array.from(node.attributes).forEach(attr => {
              // 判断是否是指令
              let attrName = attr.name // 获取属性名
              if (this.isDirective(attrName)) {
                  // v-text ---> text
                  attrName = attrName.substr(2)
                  const key = attr.value // 获取属性值
                  this.update(node, key, attrName)
              }
          })
      }
  
      update (node, key, attrName) {        
          const updateFn = this[attrName + 'Updater']
          // 改变 updateFn方法中的 this指向
          updateFn && updateFn.call(this, node, this.vm[key], key)
      }
  
      // 处理 v-text 指令
      textUpdater (node, value, key) {
          node.textContent = value
  
          new Watcher(this.vm, key, (newValue) => {
              node.textContent = newValue
          })
      }
  
      // 处理 v-model 指令
      modelUpdater (node, value, key) {
          node.value = value
  
          new Watcher(this.vm, key, (newValue) => {
              node.value = newValue
          })
          
          // 双向绑定
          node.addEventListener('input', () => {
              this.vm[key] = node.value
          })
      } 
  
      // 编译文本节点，处理 差值表达式
      compileText(node) {
          // {{ msg }}
          // . 匹配任意的单个字符，不包括换行
          // + 匹配前面修饰的字符出现一次或多次
          // ? 表示非贪婪模式，即尽可能早的结束匹配
          // 在正则表达式中，提取某个位置的内容，即添加()，进行分组        
          const reg = /\{\{(.+?)\}\}/ // 括号包裹的内容即为要提取的内容
          const value = node.textContent
          if (reg.test(value)) {
              // 使用RegExp的构造函数，获取第一个分组的内容，即.$1
              const key = RegExp.$1.trim()
              node.textContent = value.replace(reg, this.vm[key])
  
              // 创建watcher对象，当数据改变时更新视图
              new Watcher(this.vm, key, (newValue) => {
                  node.textContent = newValue
              })
          }
      }
  
      // 判断元素属性是否是指令
      isDirective(attrName) {
          // 判断attrName是否以 v- 开头
          return attrName.startsWith('v-')
      }
  
      // 判断节点是否是文本节点
      isTextNode(node) {
          return node.nodeType === 3
      }
  
      // 判断节点是否是元素节点
      isElementNode(node) {
          return node.nodeType === 1
      }
  }
  ```

### Dep(Dependency)

添加观察者(watcher)，当数据变化通知所有观察者。

![image-20201209135025627](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\01-min-module\images\image-20201209135025627.png)

**功能**

* 收集依赖，添加观察者（watcher）
* 通知所有观察者

**结构**

* 类图

  ![image-20201209135449525](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\01-min-module\images\image-20201209135449525.png)

* 具体实现，代码如下：

  ```js
  class Dep {
      constructor() {
          // 存储所有的观察者
          this.subs = []
      }
  
      // 添加观察者
      addSub(sub) {
          if (sub && sub.update) {
              this.subs.push(sub)
          }
      }
  
      // 发送通知
      notify() {
          // 遍历所有的观察者
          this.subs.forEach(sub => {
              // 调用每一个观察者的update方法，更新视图
              sub.update()
          })
      }
  }
  ```

### Watcher

数据变化更新视图。

![image-20201209140507476](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\01-min-module\images\image-20201209140507476.png)

**功能**

* 当数据变化触发依赖，dep 通知所有的 Watcher 实例更新视图
* 自身实例化的时候，往 dep 对象中添加自己

**结构**

* 类图

  ![image-20201209141245986](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\01-min-module\images\image-20201209141245986.png)

* 具体实现，代码如下：

  ```js
  class Watcher {
      constructor (vm, key, cb) {
          this.vm = vm
          // data 中的属性名称
          this.key = key
          // 回调函数负责更新视图
          this.cb = cb
  
          // 把watcher对象记录到Dep类的静态属性 target
          Dep.target = this
          // 触发get方法，在get方法中会调用addSub
          this.oldValue = vm[key]
          Dep.target = null // 防止重复添加
      }
  
      // 当数据发生变化的时候更新视图
      update () {
          const newValue = this.vm[this.key]
          if (newValue === this.oldValue) {
              return
          }
          // 当数据变化时，需要将新的值传递给回调函数，更新视图
          this.cb(newValue)
      }
  }
  ```

## 整体流程

![image-20201209160251972](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\01-min-module\images\image-20201209160251972.png)

**Vue**

* 记录传入的选项，设置 $data/$el
* 把 data 的成员注入到 Vue 实例
* 负责调用 Observer 实现数据响应式处理（数据劫持）
* 负责调用 Compiler 编译指令/插值表达式等

**Observer**

* 数据劫持

  1. 负责把 data 中的成员转换成 getter/setter

  2. 负责把多层属性转换成 getter/setter

  3. 如果给属性赋值为新对象，把新对象的成员设置为 getter/setter

* 添加 Dep 和 Watcher 的依赖关系

* 数据变化发送通知

**Compiler**

* 负责编译模板，解析指令/插值表达式
* 负责页面的首次渲染过程
* 当数据变化后重新渲染

**Dep**

* 收集依赖，添加订阅者(watcher)
* 通知所有订阅者

**Watcher**

* 自身实例化的时候往dep对象中添加自己
* 当数据变化dep通知所有的 Watcher 实例更新视图

# Virtual DOM

## 基本介绍

**什么是 Virtual DOM**

* Virtual DOM(虚拟 DOM)，是由普通的的 JS 对象来描述 DOM 对象，因为不是真实的 DOM 对象，所以叫 Virtual DOM。

* 真实 DOM 成员

  ```js
  let element = document.querySelector('#app') 
  let s = '' 
  for (var key in element) { 
      s += key + ',' 
  }
  console.log(s) 
  
  // 打印结果 align,title,lang,translate,dir,hidden,accessKey,draggable,spellcheck,aut ocapitalize,contentEditable,isContentEditable,inputMode,offsetParent,off setTop,offsetLeft,offsetWidth,offsetHeight,style,innerText,outerText,onc opy,oncut,onpaste,onabort,onblur,oncancel,oncanplay,oncanplaythrough,onc hange,onclick,onclose,oncontextmenu,oncuechange,ondblclick,ondrag,ondrag end,ondragenter,ondragleave,ondragover,ondragstart,ondrop,ondurationchan ge,onemptied,onended,onerror,onfocus,oninput,oninvalid,onkeydown,onkeypr ess,onkeyup,onload,onloadeddata,onloadedmetadata,onloadstart,onmousedown ,onmouseenter,onmouseleave,onmousemove,onmouseout,onmouseover,onmouseup, onmousewheel,onpause,onplay,onplaying,onprogress,onratechange,onreset,on resize,onscroll,onseeked,onseeking,onselect,onstalled,onsubmit,onsuspend ,ontimeupdate,ontoggle,onvolumechange,onwaiting,onwheel,onauxclick,ongot pointercapture,onlostpointercapture,onpointerdown,onpointermove,onpointe rup,onpointercancel,onpointerover,onpointerout,onpointerenter,onpointerl eave,onselectstart,onselectionchange,onanimationend,onanimationiteration ,onanimationstart,ontransitionend,dataset,nonce,autofocus,tabIndex,click ,focus,blur,enterKeyHint,onformdata,onpointerrawupdate,attachInternals,n amespaceURI,prefix,localName,tagName,id,className,classList,slot,part,at tributes,shadowRoot,assignedSlot,innerHTML,outerHTML,scrollTop,scrollLef t,scrollWidth,scrollHeight,clientTop,clientLeft,clientWidth,clientHeight ,attributeStyleMap,onbeforecopy,onbeforecut,onbeforepaste,onsearch,eleme ntTiming,previousElementSibling,nextElementSibling,children,firstElement Child,lastElementChild,childElementCount,onfullscreenchange,onfullscreen error,onwebkitfullscreenchange,onwebkitfullscreenerror,setPointerCapture ,releasePointerCapture,hasPointerCapture,hasAttributes,getAttributeNames ,getAttribute,getAttributeNS,setAttribute,setAttributeNS,removeAttribute ,removeAttributeNS,hasAttribute,hasAttributeNS,toggleAttribute,getAttrib uteNode,getAttributeNodeNS,setAttributeNode,setAttributeNodeNS,removeAtt ributeNode,closest,matches,webkitMatchesSelector,attachShadow,getElement sByTagName,getElementsByTagNameNS,getElementsByClassName,insertAdjacentE lement,insertAdjacentText,insertAdjacentHTML,requestPointerLock,getClien tRects,getBoundingClientRect,scrollIntoView,scroll,scrollTo,scrollBy,scr ollIntoViewIfNeeded,animate,computedStyleMap,before,after,replaceWith,re move,prepend,append,querySelector,querySelectorAll,requestFullscreen,web kitRequestFullScreen,webkitRequestFullscreen,createShadowRoot,getDestina tionInsertionPoints,ELEMENT_NODE,ATTRIBUTE_NODE,TEXT_NODE,CDATA_SECTION_ NODE,ENTITY_REFERENCE_NODE,ENTITY_NODE,PROCESSING_INSTRUCTION_NODE,COMME NT_NODE,DOCUMENT_NODE,DOCUMENT_TYPE_NODE,DOCUMENT_FRAGMENT_NODE,NOTATION _NODE,DOCUMENT_POSITION_DISCONNECTED,DOCUMENT_POSITION_PRECEDING,DOCUMEN T_POSITION_FOLLOWING,DOCUMENT_POSITION_CONTAINS,DOCUMENT_POSITION_CONTAI NED_BY,DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC,nodeType,nodeName,baseU RI,isConnected,ownerDocument,parentNode,parentElement,childNodes,firstCh ild,lastChild,previousSibling,nextSibling,nodeValue,textContent,hasChild Nodes,getRootNode,normalize,cloneNode,isEqualNode,isSameNode,compareDocu mentPosition,contains,lookupPrefix,lookupNamespaceURI,isDefaultNamespace ,insertBefore,appendChild,replaceChild,removeChild,addEventListener,remo veEventListener,dispatchEvent
  ```

* 可以使用 Virtual DOM 来描述真实 DOM，示例：

  ```js
  { 
  	sel: "div", 
  	data: {}, 
  	children: undefined, 
  	text: "Hello Virtual DOM", 
  	elm: undefined, 
  	key: undefined 
  }
  ```

**为什么使用 Virtual DOM**

* 手动操作 DOM 比较麻烦，还需要考虑浏览器兼容性问题，虽然有 jQuery 等库简化 DOM 操作，但是随着项目的复杂 DOM 操作复杂提升；
* 为了简化 DOM 的复杂操作于是出现了各种 MVVM 框架，MVVM 框架解决了视图和状态的同步问题；
* 为了简化视图的操作我们可以使用模板引擎，但是模板引擎没有解决跟踪状态变化的问题，于是 Virtual DOM 出现了；
* Virtual DOM 的好处是当状态改变时不需要立即更新 DOM，只需要创建一个虚拟树来描述DOM， Virtual DOM 内部将弄清楚如何有效(diff)的更新 DOM；
* 参考 github 上 [virtual-dom](https://github.com/Matt-Esch/virtual-dom) 的描述
  1. 虚拟 DOM 可以维护程序的状态，跟踪上一次的状态
  2. 通过比较前后两次状态的差异更新真实 DOM

**虚拟 DOM 的作用**

* 维护视图和状态的关系；

* 复杂视图情况下提升渲染性能；

* 除了渲染 DOM 以外，还可以实现 SSR(服务端渲染)(Nuxt.js/Next.js)、原生应用(Weex/React Native)、小程序(mpvue/uni-app)等 

  ![image-20201209165550223](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\01-min-module\images\image-20201209165550223.png)

**Virtual DOM 库**

* [Snabbdom](https://github.com/snabbdom/snabbdom)
  1. Vue 2.x 内部使用的 Virtual DOM 就是改造的 Snabbdom
  2. 大约 200 SLOC（single line of code）
  3. 通过模块可扩展
  4. 源码使用 TypeScript 开发
  5. 最快的 Virtual DOM 之一

* [virtual-dom](https://github.com/snabbdom/snabbdom)

## Snabbdom

### 基本使用

**创建项目**

* 打包工具为了方便使用 [parcel](https://parceljs.org/getting_started.html)

* 创建项目，并安装 [parcel](https://parceljs.org/getting_started.html)

  ```powershell
  # 创建项目目录 
  $ md snabbdom-demo 
  
  # 进入项目目录 
  $ cd snabbdom-demo 
  
  # 创建 package.json 
  $ yarn init -y 
  
  # 本地安装 parcel
  $ yarn add parcel-bundler
  ```

* 配置 package.json 的 scripts

  ```json
  {
      "scripts": { 
          "dev": "parcel index.html --open", 
          "build": "parcel build index.html" 
      } 
  }
  ```

* 创建目录结构

  ```markdown
  │ index.html 
  │ package.json 
  └─src 
  	01-basicusage.js 
  ```

**导入 Snabbdom**

<hr />

**Snabbdom 文档**

* 看文档的意义
  1. 学习任何一个库都要先看文档
  2. 通过文档了解库的作用
  3. 看文档中提供的示例，自己快速实现一个 demo
  4. 通过文档查看 API 的使用

* 文档地址
  1. [https://github.com/snabbdom/snabbdom](https://github.com/snabbdom/snabbdom)
  2. [中文翻译](https://github.com/coconilu/Blog/issues/152)

**安装 Snabbdom**

* 安装 Snabbdom

  ```powershell
  # 版本 0.7.4
  $ yarn add snabbdom 
  ```

**导入 Snabbdom**

* Snabbdom 的官网 demo 中导入使用的是 commonjs 模块化语法，我们使用更流行的 ES6 模块化的语法 import；

* 关于模块化的语法请参考阮一峰老师的 [Module 的语法](http://es6.ruanyifeng.com/#docs/module)；

* [ES6 模块与 CommonJS 模块的差异](https://es6.ruanyifeng.com/#docs/module-loader#ES6-%E6%A8%A1%E5%9D%97%E4%B8%8E-CommonJS-%E6%A8%A1%E5%9D%97%E7%9A%84%E5%B7%AE%E5%BC%82)

  ```js
  import { init, h, thunk } from 'snabbdom'
  ```

* Snabbdom 的核心仅提供最基本的功能，只导出了三个函数 init()、h()、thunk()

  1. init() 是一个高阶函数，返回 patch()

  2. h() 返回虚拟节点 VNode，这个函数我们在使用 Vue.js 的时候见过

     ```js
     new Vue({ 
         router, 
         store, 
         render: h => h(App) 
     }).$mount('#app')
     ```

  3. thunk() 是一种优化策略，可以在处理不可变数据时使用

* **注意**：导入时候不能使用 import snabbdom from 'snabbdom'

  原因：node_modules/src/snabbdom.ts 末尾导出使用的语法是 export 导出 API，没有使用export default 导出默认输出

  ![image-20201209184740939](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\01-min-module\images\image-20201209184740939.png)


### 基本案例

* 具体实现，代码如下：

  ```js
  import { init, h, thunk } from 'snabbdom' 
  /** -- init()
   * 参 数： 数组，将来可以传入模块，处理属性/样式/事件等 
   * 返回值：patch函数，作用：对比两个vnode的差异，更新到真实DOM
   */
  // 使用 init() 函数创建 patch() 
  let patch = init([]) 
  
  /** -- h()
   * 第一个参数：标签 + 选择器
   * 第二个参数：若是字符串，则表示 标签中的内容
   *            若是数组， 则表示创建标签中的子元素
   */
  // 使用 h() 函数创建 vnode 
  let vnode = h('div.cls', [ 
      h('h1', 'Hello Snabbdom'), 
      h('p', '这是段落') 
  ])
  
  // 获取占位元素
  const app = document.querySelector('#app') 
  
  /** -- patch()
   * 第一个参数：可以是 DOM元素，则内部会把DOM元素转换成VNode；也可以是 VNode
   * 第二个参数：VNode
   * 返回值：新的 VNode 
   */
  // 把 vnode 渲染到空的 DOM 元素（替换）
  let oldVnode = patch(app, vnode) 
  
  setTimeout(() => { 
      vnode = h('div.cls', [ 
          h('h1', 'Hello World'), 
          h('p', '这是段落') 
      ])
  
      // 把老的视图更新到新的状态 
      oldVnode = patch(oldVnode, vnode) 
  
      // 卸载 DOM，文档中 patch(oldVnode, null) 有误 
      // h('!') 是创建注释 
      patch(oldVnode, h('!')) 
  }, 2000)
  ```

### 内置模块

Snabbdom 的核心库并不能处理元素的属性/样式/事件等，如果需要处理的话，可以使用模块。

**常用模块**

<hr />

官方提供了 6 个模块。

**attributes**

* 设置 DOM 元素的属性，使用 `setAttribute ()`
* 处理布尔类型的属性

**props**

* 和 `attributes` 模块相似，设置 DOM 元素的属性 `element[attr] = value`
* 不处理布尔类型的属性

**class**

* 切换类样式
* 注意：给元素设置类样式是通过 `sel` 选择器

**dataset**

* 设置 `data-*` 的自定义属性

**eventlisteners**

* 注册和移除事件

**style**

* 设置行内样式，支持动画
* delayed/remove/destroy

**模块使用**

<hr />

**模块使用步骤**：

* 导入需要的模块，类似插件，不在 Snabbdom 的核心库内
* init() 中注册模块
* 使用 h() 函数创建 VNode 的时候，可以把第二个参数设置为对象，其他参数往后移

**案例演示**

* 具体实现，代码如下：

  ```js
  import { h, init } from 'snabbdom' 
  // 导入需要的模块 
  import style from 'snabbdom/modules/style' 
  import eventlisteners from 'snabbdom/modules/eventlisteners' 
  
  // 使用 init() 函数创建 patch() 
  // init() 的参数是数组，将来可以传入模块，处理属性/样式/事件等 
  let patch = init([ 
      // 注册模块 
      style, 
      eventlisteners 
  ])
  // 使用 h() 函数创建 vnode，h() 函数的第二个参数，传入模块需要的数据(对象)
  let vnode = h('div.cls', { 
      // 设置 DOM 元素的行内样式 
      style: { 
          color: '#DEDEDE', 
          backgroundColor: '#181A1B' 
      }, 
      // 注册事件 
      on: { 
          click: clickHandler 
      } 
  }, [
      h('h1', 'Hello Snabbdom'), 
      h('p', '这是段落') 
  ])
  
  function clickHandler () { 
      // 此处的 this 指向对应的 vnode 
      console.log(this.elm.innerHTML) 
  }
  
  const app = document.querySelector('#app')
  // 把 vnode 渲染到空的 DOM 元素（替换） 
  // 会返回新的 vnode
  patch(app, vnode)
  ```

### 源码解析

**基本介绍**

<hr />

**如何学习源码**

* 先宏观了解，整理了解库的核心执行过程
* 带着目标看源码
* 看源码的过程要不求甚解
* 调试
* 参考资料

**Snabbdom** **的核心**

* 使用 h() 函数创建 JavaScript 对象(VNode)描述真实 DOM
* init() 设置模块，创建 patch()
* patch() 比较新旧两个 VNode
* 把变化的内容更新到真实 DOM 树上

**Snabbdom** **源码**

* 源码地址：

  * [https://github.com/snabbdom/snabbdom](https://github.com/snabbdom/snabbdom)

* src 目录结构

  ```markdown
  │ h.ts                     h() 函数，用来创建 VNode 
  │ hooks.ts                 所有钩子函数的定义 
  │ htmldomapi.ts            对 DOM API 的包装 
  │ is.ts                    判断数组和原始值的函数 
  │ jsx-global.d.ts          jsx 的类型声明文件 
  │ jsx.ts                   处理 jsx 
  │ snabbdom.bundle.ts       入口，已经注册了模块 
  │ snabbdom.ts              初始化，返回 init/h/thunk 
  │ thunk.ts                 优化处理，对复杂视图不可变值得优化 
  │ tovnode.ts DOM           转换成 VNode 
  │ vnode.ts                 虚拟节点定义 
  │
  ├─helpers 
  │       attachto.ts        定义了 vnode.ts 中 AttachData 的数据结构 
  │
  └─modules                  所有模块定义 
          attributes.ts 
          class.ts 
          dataset.ts 
          eventlisteners.ts 
          hero.ts            example 中使用到的自定义钩子 
          module.ts          定义了模块中用到的钩子函数 
          props.ts 
          style.ts 
  ```

**源码解析**

<hr />

**h 函数**

* h() 函数介绍

  1. 在使用 Vue 的时候见过 h() 函数

     ```js
     new Vue({ 
         router, 
         store, 
         render: h => h(App) // 组件机制
     }).$mount('#app') 
     ```

  2. h() 函数最早见于 hyperscript，使用 JavaScript 创建超文本

  3. Snabbdom 中的 h() 函数不是用来创建超文本，而是`创建 VNode`

* 函数重载

  1. 概念
     * **参数个数**或**类型**不同的函数
     * JavaScript 中没有重载的概念
     * TypeScript 中有重载，不过重载的实现还是通过代码调整参数

  2. 重载的示意

     ```js
     function add (a, b) { 
         console.log(a + b) 
     }
     
     function add (a, b, c) { 
         console.log(a + b + c) 
     }
     
     add(1, 2) 
     add(1, 2, 3) 
     ```

* 源码位置：src/h.ts

  ```tsx
  // h 函数的重载
  export function h(sel: string): VNode;
  export function h(sel: string, data: VNodeData): VNode;
  export function h(sel: string, children: VNodeChildren): VNode;
  export function h(sel: string, data: VNodeData, children: VNodeChildren): VNode;
  export function h(sel: any, b?: any, c?: any): VNode {
      var data: VNodeData = {}, children: any, text: any, i: number;
      // 处理参数，实现重载的机制
      if (c !== undefined) {
          // 处理三个参数的情况
          // sel、data、children/text
          data = b;
          if (is.array(c)) { children = c; }
          // 如果 c 是字符串或者数字
          else if (is.primitive(c)) { text = c; }
          // 如果 c 是VNode
          else if (c && c.sel) { children = [c]; }
      } else if (b !== undefined) {
          // 处理两个参数的情况
          // 如果 b 是数组
          if (is.array(b)) { children = b; }
          // 如果 b 是字符串或者数字
          else if (is.primitive(b)) { text = b; }
          // 如果 b 是VNode
          else if (b && b.sel) { children = [b]; }
          else { data = b; }
      }
      if (children !== undefined) {
          // 处理 children 中的原始值（string/number）
          for (i = 0; i < children.length; ++i) {
              // 如果 child 是 string/number，创建文本节点
              if (is.primitive(children[i])) children[i] = vnode(undefined, undefined, undefined, children[i], undefined);
          }
      }
      if (
          sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' &&
          (sel.length === 3 || sel[3] === '.' || sel[3] === '#')
      ) {
          // 如果是 svg，添加命名空间
          addNS(data, children, sel);
      }
      // 返回 VNode
      return vnode(sel, data, children, text, undefined);
  };
  // 导出模块
  export default h;
  ```

**VNode**

* 一个 VNode 就是一个虚拟节点用来描述一个 DOM 元素，如果这个 VNode 有 children 就是Virtual DOM

* 源码位置：src/vnode.ts

  ```tsx
  // interface 接口，
  // 目的：约束实现这个接口的所有对象都拥有相同的属性
  export interface VNode {
    // 选择器
    sel: string | undefined;
    // 模块，节点数据：属性/样式/事件等
    data: VNodeData | undefined;
    // 子节点，和 text 只能互斥
    children: Array<VNode | string> | undefined;
    // 记录 vnode 对应的真实 DOM
    elm: Node | undefined;
    // 节点中的内容，和 children 只能互斥
    text: string | undefined;
    // 优化用
    key: Key | undefined;
  }
  
  export function vnode(sel: string | undefined,
                        data: any | undefined,
                        children: Array<VNode | string> | undefined,
                        text: string | undefined,
                        elm: Element | Text | undefined): VNode {
    let key = data === undefined ? undefined : data.key;
    return {sel, data, children, text, elm, key};
  }
  
  export default vnode;
  ```

**patch 的整体流程**

* patch(oldVnode, newVnode) -- `snabbdom 核心`

* 打补丁，把新节点中变化的内容渲染到真实 DOM，最后返回新节点作为下一次处理的旧节点

* 对比新旧 VNode 是否相同节点(节点的 key 和 sel 相同)

* 如果不是相同节点，删除之前的内容，重新渲染

* 如果是相同节点，再判断新的 VNode 是否有 text，如果有并且和 oldVnode 的 text 不同，直接更新文本内容

* 如果新的 VNode 有 children，判断子节点是否有变化，判断子节点的过程使用的就是 diffff 算法

* diffff 过程只进行同层级比较

  ![image-20201210100717428](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\01-min-module\images\image-20201210100717428.png)

**init**

* **功能：**init(modules, domApi)，返回 patch() 函数（高阶函数）

* 为什么要使用高阶函数？

  1. 因为 patch() 函数再外部会调用多次，每次调用依赖一些参数，比如：modules/domApi/cbs
  2. 通过高阶函数让 init() 内部形成闭包，返回的 patch() 可以访问到 modules/domApi/cbs，而不需要重新创建

* init() 在返回 patch() 之前，首先收集了所有模块中的钩子函数存储到 cbs 对象中

* 源码位置：src/snabbdom.ts

  ```tsx
  // 存储了钩子函数的名字
  const hooks: (keyof Module)[] = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];
  // domAPI 执行DOM操作
  export function init(modules: Array<Partial<Module>>, domApi?: DOMAPI) {
      let i: number, j: number, cbs = ({} as ModuleHooks);
      // 初始化转换虚拟节点的 api
      const api: DOMAPI = domApi !== undefined ? domApi : htmlDomApi;
      // 把传入的所有模块的钩子函数，统一存储到 cbs 对象中
      // 最终构建的 cbs 对象的形式 cbs = { create: [], update: [], ... }
      for (i = 0; i < hooks.length; ++i) {
          // cbs.create = [], cbs.update = [], ...
          cbs[hooks[i]] = [];
          for (j = 0; j < modules.length; ++j) {
              // modules 传入的模块数组
              // 获取模块中的 hook 函数
              // hook = modules[0][create]...
              const hook = modules[j][hooks[i]];
              if (hook !== undefined) {
                  // 把获取到的hook函数放入到 cbs 对应的钩子函数数组中
                  (cbs[hooks[i]] as Array<any>).push(hook);
              }
          }
      }
  
      ......
      ......
      ......
      // init 内部返回 patch 函数，把vnode渲染成真实 dom，并返回vnode
      // 高阶函数，在一个函数内部返回一个函数
      return function patch(oldVnode: VNode | Element, vnode: VNode): VNode {
          .....
      };
  }
  ```

**patch**

* **功能：**

  1. 传入新旧 VNode，对比差异，把差异渲染到 DOM
  2. 返回新的 VNode，作为下一次 patch() 的 oldVnode

* **执行过程：**

  1. 首先执行**模块**中的**钩子**函数 pre
  2. 如果 oldVnode 和 vnode 相同（key 和 sel 相同）
     * 调用 patchVnode()，找节点的差异并更新 DOM
  3. 如果 oldVnode 是 DOM 元素
     * 把 DOM 元素转换成 oldVnode
     * 调用 createElm() 把 vnode 转换为真实 DOM，记录到 vnode.elm
     * 把刚创建的 DOM 元素插入到 parent 中
     * 移除老节点
     * 触发**用户**设置的 create **钩子**函数

* 源码位置：src/snabbdom.ts

  ```tsx
  return function patch(oldVnode: VNode | Element, vnode: VNode): VNode {
      let i: number, elm: Node, parent: Node;
      // 保存新插入节点的队列，为了触发钩子函数
      const insertedVnodeQueue: VNodeQueue = [];
      // 执行模块的 pre 钩子函数，pre 预处理
      for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();
  
      // 如果 oldVnode 不是 VNode，创建 VNode 并设置 elm
      if (!isVnode(oldVnode)) {
          // 把 DOM 元素转换成空的 VNode
          oldVnode = emptyNodeAt(oldVnode);
      }
  
      // 如果新旧节点是相同节点(key 和 sel 相同)
      if (sameVnode(oldVnode, vnode)) {
          // 找节点的差异并更新 DOM
          patchVnode(oldVnode, vnode, insertedVnodeQueue);
      } else {
          // 如果新旧节点不同，vnode 创建对应的 DOM
          // 获取当前的 DOM 元素
          elm = oldVnode.elm!;
          parent = api.parentNode(elm);
  
          // 创建 vnode 对应的 DOM 元素，并触发 init/create 钩子函数
          createElm(vnode, insertedVnodeQueue);
  
          if (parent !== null) {
              // 如果父节点不为空，把 vnode 对应的 DOM　插入到文档中
              // ! typescript 语法，告诉编译器vnode.elm是百分百有值的
              api.insertBefore(parent, vnode.elm!, api.nextSibling(elm));
              // 移除老节点
              removeVnodes(parent, [oldVnode], 0, 0);
          }
      }
  
      // 执行用户设置的 insert 钩子函数
      for (i = 0; i < insertedVnodeQueue.length; ++i) {
          (((insertedVnodeQueue[i].data as VNodeData).hook as Hooks).insert as any)(insertedVnodeQueue[i]);
      }
      // 执行模块的 post 钩子函数
      for (i = 0; i < cbs.post.length; ++i) cbs.post[i]();
      // 返回 vnode
      return vnode;
  };
  ```

**createElm**

* **功能：**

  1. createElm(vnode, insertedVnodeQueue)，返回创建的 DOM 元素
  2. 创建 vnode 对应的 DOM 元素

* **执行过程：**

  1. 首先触发**用户**设置的 **init** **钩子**函数
  2. 如果选择器是!，创建评论节点
  3. 如果选择器为空，创建文本节点
  4. 如果选择器不为空
     * 解析选择器，设置标签的 id 和 class 属性
     * 执行**模块**的 **create** **钩子**函数
     * 如果 vnode 有 children，创建子 vnode 对应的 DOM，追加到 DOM 树
     * 如果 vnode 的 text 值是 string/number，创建文本节点并追击到 DOM 树
     * 执行**用户**设置的 **create** **钩子**函数
     * 如果有用户设置的 insert 钩子函数，把 vnode 添加到队列中

* 源码位置：src/snabbdom.ts

  ```js
  // 作用：把 VNode 转换成对应的 DOM 元素，但是并不会把 DOM 渲染到页面中
  function createElm(vnode: VNode, insertedVnodeQueue: VNodeQueue): Node {
      let i: any, data = vnode.data;
      if (data !== undefined) {
          // 执行用户设置的 init 的钩子函数
          const init = data.hook?.init; 
          if (isDef(init)) { 
              init(vnode); 
              data = vnode.data; 
          }
      }
      // 把 vnode 转换成真实 DOM 对象（没有渲染到页面）
      let children = vnode.children, sel = vnode.sel;
      if (sel === '!') {
          // 如果选择器是!，创建注释节点
          if (isUndef(vnode.text)) {
              vnode.text = '';
          }
          vnode.elm = api.createComment(vnode.text!);
      } else if (sel !== undefined) {
          // 如果选择器不为空
          // 解析选择器
          // Parse selector 
          const hashIdx = sel.indexOf('#');
          const dotIdx = sel.indexOf('.', hashIdx);
          const hash = hashIdx > 0 ? hashIdx : sel.length;
          const dot = dotIdx > 0 ? dotIdx : sel.length;
          const tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
          // data.ns 是否有命名空间
          const elm = vnode.elm = isDef(data) && isDef(i = (data as VNodeData).ns) ? api.createElementNS(i, tag)
          : api.createElement(tag);
          if (hash < dot) elm.setAttribute('id', sel.slice(hash + 1, dot));
          if (dotIdx > 0) elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '));
          // 执行模块的 create 钩子函数
          for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode);
          // 如果 vnode 中有子节点，创建子 vnode 对应的 DOM 元素，并追加到 DOM 树上
          if (is.array(children)) {
              for (i = 0; i < children.length; ++i) {
                  const ch = children[i];
                  if (ch != null) {
                      api.appendChild(elm, createElm(ch as VNode, insertedVnodeQueue));
                  }
              }
          } else if (is.primitive(vnode.text)) {
              // 如果 vnode 的 text 值是 string/number，创建文本节点，并追加到 DOM 树上
              api.appendChild(elm, api.createTextNode(vnode.text));
          }
          const hook = vnode.data!.hook; 
          if (isDef(hook)) { 
              // 执行用户传入的钩子 create 
              hook.create?.(emptyNode, vnode); 
              if (hook.insert) { 
                  // 把 vnode 添加到队列中，为后续执行 insert 钩子做准备
                  insertedVnodeQueue.push(vnode); 
              } 
          }
      } else {
          // 如果选择器为空，创建文本节点
          vnode.elm = api.createTextNode(vnode.text!);
      }
      // 返回新创建的 DOM
      return vnode.elm;
  }
  ```

* 思维导图

  ![image-20201210114009628](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\01-min-module\images\image-20201210114009628.png)

**removeVnodes**



**addVnodes**



**patchVnode**

* **功能：**

  1. patchVnode(oldVnode, vnode, insertedVnodeQueue)
  2. 对比 oldVnode 和 vnode 的差异，把差异渲染到 DOM

* **执行过程：**

  1. 首先执行**用户**设置的 **prepatch** **钩子**函数
  2. 执行 create 钩子函数
     * 首先执行**模块**的 **create** **钩子**函数
     * 然后执行**用户**设置的 **create** **钩子**函数
  3. 如果 **vnode.text** 未定义
     * 如果 oldVnode.children 和 vnode.children 都有值
       1. 调用 updateChildren()
       2. 使用 diffff 算法对比子节点，更新子节点
     * 如果 vnode.children 有值， oldVnode.children 无值
       1. 清空 DOM 元素
       2. 调用 addVnodes() ，批量添加子节点
     * 如果 oldVnode.children 有值， vnode.children 无值
       1. 调用 removeVnodes() ，批量移除子节点
     * 如果 **oldVnode.text** 有值
       1. 清空 DOM 元素的内容
  4. 如果设置了 vnode.text 并且和和 oldVnode.text 不等
     * 如果老节点有子节点，全部移除
     * 设置 DOM 元素的 textContent 为 vnode.text
  5. 最后执行用户**设置的** **postpatch** **钩子**函数

* 源码位置：src/snabbdom.ts

  ```tsx
  function patchVnode(oldVnode: VNode, vnode: VNode, insertedVnodeQueue: VNodeQueue) {
      const hook = vnode.data?.hook;
      // 首先执行用户设置的 prepatch 钩子函数
      hook?.prepatch?.(oldVnode, vnode);
      const elm = vnode.elm = oldVnode.elm!;
      let oldCh = oldVnode.children as VNode[];
      let ch = vnode.children as VNode[];
      // 如果新老 vnode 相同，直接返回
      if (oldVnode === vnode) return;
      if (vnode.data !== undefined) {
          // 执行模块的 update 钩子函数
          for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
          // 执行用户设置的 update 钩子函数
         vnode.data.hook?.update?.(oldVnode, vnode);
      }
      // 如果 vnode.text 未定义
      if (isUndef(vnode.text)) {
          // 如果新老节点都有 children
          if (isDef(oldCh) && isDef(ch)) {
              // 使用 diff 算法对比子节点，更新子节点
              if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue);
          } else if (isDef(ch)) {
              // 如果新节点有 children，老节点没有 children
              // 如果老节点有 text，清空 dom 元素的内容
              if (isDef(oldVnode.text)) api.setTextContent(elm, '');
              // 批量添加子节点
              addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
          } else if (isDef(oldCh)) {
              // 如果老节点有 children，新节点没有 children
              // 批量移除子节点
              removeVnodes(elm, oldCh, 0, oldCh.length - 1);
          } else if (isDef(oldVnode.text)) {
              // 如果老节点有 text，清空 DOM　元素
              api.setTextContent(elm, '');
          }
      } else if (oldVnode.text !== vnode.text) {
          // 如果没有设置 vnode.text
          if (isDef(oldCh)) {
              // 如果老节点有 children，移除
              removeVnodes(elm, oldCh, 0, oldCh.length - 1);
          }
          // 设置 DOM 元素的 textContent 为 vnode.text
          api.setTextContent(elm, vnode.text!);
      }
      // 最后执行用户设置的 postpatch 钩子函数
      hook?.postpatch?.(oldVnode, vnode);
  }
  ```

* 思维导图

  ![image-20201210145730019](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\01-min-module\images\image-20201210145730019.png)

**updateChildren**

* **功能：**

  diffff 算法的核心，对比新旧节点的 children，更新 DOM

* **执行过程：**

  * 要对比两棵树的差异，我们可以取第一棵树的每一个节点依次和第二课树的每一个节点比较，但是这样的时间复杂度为 O(n^3)

  * 在DOM 操作的时候我们很少会把一个父节点移动/更新到某一个子节点

  * 因此只需要找**同级别**的**子节点**依次**比较**，然后再找下一级别的节点比较，这样算法的时间复杂度为 O(n)

    ![image-20201210162718621](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\01-min-module\images\image-20201210162718621.png)

  * 在进行同级别节点比较的时候，首先会对新老节点数组的开始和结尾节点设置标记索引，遍历的过程中移动索引

  * 在对**开始和结束节点**比较的时候，总共有四种情况

    1. oldStartVnode / newStartVnode (旧开始节点 / 新开始节点)
    2. oldEndVnode / newEndVnode (旧结束节点 / 新结束节点)
    3. oldStartVnode / oldEndVnode (旧开始节点 / 新结束节点)
    4. oldEndVnode / newStartVnode (旧结束节点 / 新开始节点)

    ![image-20201210162849734](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\01-min-module\images\image-20201210162849734.png)

  * 开始节点和结束节点比较，这两种情况类似
    1. oldStartVnode / newStartVnode (旧开始节点 / 新开始节点)
    2. oldEndVnode / newEndVnode (旧结束节点 / 新结束节点)

  * 如果 oldStartVnode 和 newStartVnode 是 sameVnode (key 和 sel 相同)

    1. 调用 patchVnode() 对比和更新节点
    2. 把旧开始和新开始索引往后移动 oldStartIdx++ / oldEndIdx++

    ![image-20201210163141109](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\01-min-module\images\image-20201210163141109.png)

  * oldStartVnode / newEndVnode (旧开始节点 / 新结束节点) 相同

    1. 调用 patchVnode() 对比和更新节点
    2. 把 oldStartVnode 对应的 DOM 元素，移动到右边
       * 更新索引

    ![image-20201210163426460](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\01-min-module\images\image-20201210163426460.png)

  * oldEndVnode / newStartVnode (旧结束节点 / 新开始节点) 相同

    1. 调用 patchVnode() 对比和更新节点
    2. 把 oldEndVnode 对应的 DOM 元素，移动到左边
    3. 更新索引

    ![image-20201210163530552](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\01-min-module\images\image-20201210163530552.png)

  * 如果不是以上四种情况

    1. 遍历新节点，使用 newStartNode 的 key 在老节点数组中找相同节点
    2. 如果没有找到，说明 newStartNode 是新节点
       * 创建新节点对应的 DOM 元素，插入到 DOM 树中
    3. 如果找到了
       * 判断新节点和找到的老节点的 sel 选择器是否相同
       * 如果不相同，说明节点被修改了
         1. 重新创建对应的 DOM 元素，插入到 DOM 树中
       * 如果相同，把 elmToMove 对应的 DOM 元素，移动到左边

    ![image-20201210163719827](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\01-min-module\images\image-20201210163719827.png)

  * 循环结束

    1. 当老节点的所有子节点先遍历完 (oldStartIdx > oldEndIdx)，循环结束
    2. 新节点的所有子节点先遍历完 (newStartIdx > newEndIdx)，循环结束

  * 如果老节点的数组先遍历完(oldStartIdx > oldEndIdx)，说明新节点有剩余，把剩余节点批量插入到右边

    ![image-20201210163822394](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\01-min-module\images\image-20201210163822394.png)

  * 如果新节点的数组先遍历完(newStartIdx > newEndIdx)，说明老节点有剩余，把剩余节点批量删除

    ![image-20201210163909504](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\01-min-module\images\image-20201210163909504.png)

* 源码位置：src/snabbdom.ts

  ```tsx
  // VNode 的核心
  function updateChildren(parentElm: Node,
                           oldCh: Array<VNode>,
                           newCh: Array<VNode>,
                           insertedVnodeQueue: VNodeQueue) {
      // 新老开始节点的索引
      let oldStartIdx = 0, newStartIdx = 0;
      // 老的结束节点的索引
      let oldEndIdx = oldCh.length - 1;
      // 老的开始节点
      let oldStartVnode = oldCh[0];
      // 老的结束节点
      let oldEndVnode = oldCh[oldEndIdx];
      // 新的结束节点的索引
      let newEndIdx = newCh.length - 1;
      // 新的开始节点
      let newStartVnode = newCh[0];
      // 新的结束节点
      let newEndVnode = newCh[newEndIdx];
      let oldKeyToIdx: any;
      let idxInOld: number;
      let elmToMove: VNode;
      let before: any;
  
      // 对比所有的新旧子节点
      while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
          // 索引变化后,可能会把节点设置为空
          if (oldStartVnode == null) {
              // 节点为空移动索引
              oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
          } else if (oldEndVnode == null) {
              oldEndVnode = oldCh[--oldEndIdx];
          } else if (newStartVnode == null) {
              newStartVnode = newCh[++newStartIdx];
          } else if (newEndVnode == null) {
              newEndVnode = newCh[--newEndIdx];
              // 比较开始和结束节点的四种情况
          } else if (sameVnode(oldStartVnode, newStartVnode)) {
              // 1. 比较老的开始节点和新的开始节点
              patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
              oldStartVnode = oldCh[++oldStartIdx];
              newStartVnode = newCh[++newStartIdx];
          } else if (sameVnode(oldEndVnode, newEndVnode)) {
              // 2. 比较老的结束节点和新的结束节点
              patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
              oldEndVnode = oldCh[--oldEndIdx];
              newEndVnode = newCh[--newEndIdx];
          } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
              // 3. 比较老的开始节点和新的结束节点
              patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
              api.insertBefore(parentElm, oldStartVnode.elm!, api.nextSibling(oldEndVnode.elm!));
              oldStartVnode = oldCh[++oldStartIdx];
              newEndVnode = newCh[--newEndIdx];
          } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
              // 4. 比较老的结束节点和新的开始节点
              patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
              api.insertBefore(parentElm, oldEndVnode.elm!, oldStartVnode.elm!);
              oldEndVnode = oldCh[--oldEndIdx];
              newStartVnode = newCh[++newStartIdx];
          } else {
              // 开始节点和结束节点都不相同
              // 使用 newStartNode 的 key 在老的节点数组中找相同节点
              // 先设置记录 key 和 index 的对象
              if (oldKeyToIdx === undefined) {
                  oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
              }
              // 遍历 newStartVnode,从老的节点中找相同 key 的 oldVnode 的索引
              idxInOld = oldKeyToIdx[newStartVnode.key as string];
              // 如果是新的 vnode
              if (isUndef(idxInOld)) { // New element
                  // 如果没找到,newStartVnode 是新节点
                  // 创建元素插入 DOM 树
                  api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm!);
                  // 重新给 newStartVnode 赋值,指向下一个新节点
                  newStartVnode = newCh[++newStartIdx];
              } else {
                  // 如果找到相同 key 相同的老节点,记录到 elmToMove 遍历
                  elmToMove = oldCh[idxInOld];
                  if (elmToMove.sel !== newStartVnode.sel) {
                      // 如果新旧节点的选择器不同
                      // 创建新开始节点对应的 DOM 元素,插入到 DOM 树中
                      api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm!);
                  } else {
                      // 如果相同,patchVnode()
                      // 把 elmToMove 对应的 DOM 元素,移动到左边
                      patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
                      oldCh[idxInOld] = undefined as any;
                      api.insertBefore(parentElm, elmToMove.elm!, oldStartVnode.elm!);
                  }
                  // 重新给 newStartVnode 赋值,指向下一个新节点
                  newStartVnode = newCh[++newStartIdx];
              }
          }
      }
      // 循环结束,老节点数组先遍历完成或者新节点数组先遍历完成
      if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
          if (oldStartIdx > oldEndIdx) {
              // 如果老节点数组先遍历完成,说明有新的节点剩余
              // 把剩余的新节点都插入到右边
              before = newCh[newEndIdx+1] == null ? null : newCh[newEndIdx+1].elm;
              addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
          } else {
              // 如果新节点数组先遍历完成,说明老节点有剩余
              // 批量删除老节点
              removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
          }
      }
  }
  ```

**调试 updateChildren**

<hr />

* ```html
  <ul>
      <li>首页</li> 
      <li>微博</li> 
      <li>视频</li> 
  </ul> 
  <ul>
      <li>首页</li> 
      <li>视频</li> 
      <li>微博</li> 
  </ul>
  ```

  ![image-20201210175137212](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\01-min-module\images\image-20201210175137212.png)

**调试带 key 的情况**

* ```html
  <ul>
      <li key="a">首页</li> 
      <li key="b">微博</li> 
      <li key="c">视频</li> 
  </ul> 
  <ul>
      <li key="a">首页</li> 
      <li key="c">视频</li> 
      <li key="b">微博</li> 
  </ul>
  ```

**总结**

通过以上调试 updateChildren，我们发现不带 key 的情况需要进行两次 DOM 操作，带 key 的情况只需要更新一次 DOM 操作(移动 DOM 项)，所以带 key 的情况可以减少 DOM 的操作，如果 li 中的子项比较多，更能体现出带 key 的优势。

**Modules 源码**

<hr />

* patch() -> patchVnode() -> updateChildren()
* Snabbdom 为了保证核心库的精简，把处理元素的属性/事件/样式等工作，放置到模块中
* 模块可以按照需要引入
* 模块的使用可以查看官方文档
* 模块实现的核心是基于 Hooks

**Hooks**

* 预定义的钩子函数的名称

* 源码位置：src/hooks.ts

  ```tsx
  
  export interface Hooks {
      // patch 函数开始执行的时候触发
      pre?: PreHook;
      // createElm 函数开始之前的时候触发
      // 在把 VNode 转换成真实 DOM 之前触发
      init?: InitHook;
      // createElm 函数末尾调用
      // 创建完真实 DOM 后触发
      create?: CreateHook;
      // patchVnode 函数末尾执行
      // 真实 DOM 添加到 DOM　树中触发
      insert?: InsertHook;
      // patchVnode 函数开头调用
      // 开始对比两个 VNode 的差异之前触发
      prepatch?: PrePatchHook;
      // patchVnode 函数开头调用
      // 两个 VNode 对比过程中触发,比 prepatch 稍晚
      update?: UpdateHook;
      // patchVnode 的最末尾调用
      // 两个 VNode 对比结束执行
      postpatch?: PostPatchHook;
      // removeVnodes -> inVokeDestroyHook 中调用
      // 在删除元素之前触发,子节点的 destroy 也被触发
      destroy?: DestroyHook;
      // removeVnodes 中调用
      // 
      remove?: RemoveHook;
      post?: PostHook;
  }
  ```

**Modules**

**模块文件的定义**

Snabbdom 提供的所有模块在：src/modules 文件夹下，主要模块有：

* attributes.ts
  1. 使用 setAttribute/removeAttribute 操作属性
  2. 能够处理 boolean 类型的属性
* class.ts
  1. 切换类样式
* dataset.ts
  1. 操作元素的 data-* 属性
* eventlisteners.ts
  1. 注册和移除事件
* module.ts
  1. 定义模块遵守的钩子函数
* props.ts
  1. 和 attributes.ts 类似，但是是使用 elm[attrName] = value 的方式操作属性
* style.ts
  1. 操作行内样式
  2. 可以使动画更平滑
* hero.ts
  1. 自定义的模块，examples/hero 示例中使用

**attributes.ts**

* 模块到出成员

  ```tsx
  export const attributesModule = { 
      create: updateAttrs, 
      update: updateAttrs 
  } as Module; 
  export default attributesModule;
  ```

* updateAttrs 函数功能

  1. 更新节点属性
  2. 如果节点属性值是 true 设置空置
  3. 如果节点属性值是 false 移除属性

* updateAttrs 实现

  ```tsx
  
  function updateAttrs(oldVnode: VNode, vnode: VNode): void {
      var key: string, elm: Element = vnode.elm as Element,
          oldAttrs = (oldVnode.data as VNodeData).attrs,
          attrs = (vnode.data as VNodeData).attrs;
      // 新老节点没有 attrs 属性,返回
      if (!oldAttrs && !attrs) return;
      // 新老节点的 attrs 属性相同,返回
      if (oldAttrs === attrs) return;
      oldAttrs = oldAttrs || {};
      attrs = attrs || {};
  
      // update modified attributes, add new attributes
      // 遍历新节点的属性
      for (key in attrs) {
          // 新老节点的属性值
          const cur = attrs[key];
          const old = oldAttrs[key];
          // 如果新老节点的属性值不同
          if (old !== cur) {
              // 布尔类型值的处理
              if (cur === true) {
                  elm.setAttribute(key, "");
              } else if (cur === false) {
                  elm.removeAttribute(key);
              } else {
                  // xChar -> x
                  // <svg xmlns="http://www.w3.org/2000/scg">
                  if (key.charCodeAt(0) !== xChar) {
                      elm.setAttribute(key, cur);
                  } else if (key.charCodeAt(3) === colonChar) {
                      // colonChar -> :
                      // Assume xml namespace
                      elm.setAttributeNS(xmlNS, key, cur);
                  } else if (key.charCodeAt(5) === colonChar) {
                      // Assume xlink namespace
                      // <svg xmlns:xlink="http://www.w3.org/1999/xlink">
                      elm.setAttributeNS(xlinkNS, key, cur);
                  } else {
                      elm.setAttribute(key, cur);
                  }
              }
          }
      }
      // remove removed attributes
      // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
      // the other option is to remove all attributes with value == undefined
      // 如果老节点的属性在新节点中不存在,移除
      for (key in oldAttrs) {
          if (!(key in attrs)) {
              elm.removeAttribute(key);
          }
      }
  }
  ```

  

