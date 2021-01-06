@[TOC](Vuex 状态管理)

# 课程目标

* Vue 组件间通信方式回顾
* Vuex 核心概念和基本使用回顾
* 购物车案例
* 模拟实现 Vuex

# 组件内的状态管理流程

Vue 最核心的两个功能：**数据驱动**和**组件化**。

组件化开发给我们带来了：

* 更快的开发效率
* 更好的可维护性

每个组件都有自己的状态、视图和行为等组成部分。

```js
new Vue({ 
    // state 状态
    data () { 
        return { 
            count: 0 
        } 
    },
    // view 视图
    template: ` <div>{{ count }}</div> `,
    // actions 行为
    methods: { 
        increment () { 
            this.count++ 
        } 
    } 
})
```

## 状态管理

### 组成部分

* **state**，驱动应用的数据源；
* **view**，以声明方式将 **state** 映射到视图；
* **actions**，响应在 **view** 上的用户输入导致的状态变化。

![image-20201228140614023](C:\Users\li_sh\AppData\Roaming\Typora\typora-user-images\image-20201228140614023.png#pic_center)

## 组件间通信方式

大多数场景下的组件都并不是独立存在的，而是相互协作共同构成了一个复杂的业务功能。在 Vue 中为不同的组件关系提供了不同的通信规则。

### 三种组件间通信方式

![image-20201228141840514](C:\Users\li_sh\AppData\Roaming\Typora\typora-user-images\image-20201228141840514.png)

#### [父组件给子组件传值](https://cn.vuejs.org/v2/guide/components.html#%E9%80%9A%E8%BF%87-Prop-%E5%90%91%E5%AD%90%E7%BB%84%E4%BB%B6%E4%BC%A0%E9%80%92%E6%95%B0%E6%8D%AE)

* 子组件中通过 **`props`** 接收数据

  ```js
  Vue.component('child', { 
      // 接收父组件传给子组件的值
  	// props: ['title'], 
      props: { // 通过对象接收，可以设置 数据的类型以及默认值...
          title: String
      },
      template: '<h3>{{ title }}</h3>' 
  })
  ```

* 父组件中给子组件通过相应属性传值

  ```vue
  <!-- 通过属性，将值从父组件传给子组件 -->
  <child title="My journey with Vue"></child>
  ```

#### [子组件给父组件传值](https://cn.vuejs.org/v2/guide/components.html#%E7%9B%91%E5%90%AC%E5%AD%90%E7%BB%84%E4%BB%B6%E4%BA%8B%E4%BB%B6)

* 在子组件中使用 **`$emit`** 发布一个自定义事件：

  ```vue
  <template>
  	<button @click="handler">Enlarge text</button>
  </template>
  
  <script>
      export default {
          methods: {
              handler () {
                  // 自定义事件 enlargeText
                  // this 当前子组件对象，即由子组件触发的自定义事件
                  this.$emit('enlargeText', 0.1)
              }
          }
      }
  </script>
  ```

* 在父组件中，使用子组件时，使用 **`v-on`** 监听这个自定义事件

  ```vue
  <template>
      <!-- 给子组件注册自定义事件 enlargeText -->
      <child :fontSize="hFontSize" v-on:enlargeText="enlargeText"></child>
  </template>
  
  <script>
      export default {
          methods: {
              // 子组件把值传递给父组件
              enlargeText (size) {
                  this.hFontSize += size
              }
          }
      }
  </script>
  ```

  [使用 **`$event`** (事件) 抛出一个值](https://cn.vuejs.org/v2/guide/components.html#%E4%BD%BF%E7%94%A8%E4%BA%8B%E4%BB%B6%E6%8A%9B%E5%87%BA%E4%B8%80%E4%B8%AA%E5%80%BC)

  ```vue
  <!-- $event 为触发自定义事件时，传递的值 -->
  <child :fontSize="hFontSize" v-on:enlargeText="hFontSize += $event"></child>
  ```

#### [不相干组件之间传值](https://cn.vuejs.org/v2/guide/migration.html#dispatch-%E5%92%8C-broadcast-%E6%9B%BF%E6%8D%A2)

* 首先，使用一个非常简单的 **`Event Bus`** 来解决这个问题：

  `eventbus.js` ：

  ```js
  // 创建一个公共的 Vue 实例
  import Vue from 'vue'
  export default new Vue()
  ```

* 然后在需要通信的两端：

  * 使用 $on 订阅：

  ```js
  import bus from './eventbus'
  
  // 没有参数 
  bus.$on('自定义事件名称', () => { 
      // 执行操作 
  })
  
  // 有参数 
  bus.$on('自定义事件名称', data => { 
      // 执行操作 
  })
  ```

  * 使用 $emit 发布：

  ```js
  // 没有自定义传参 
  bus.$emit('自定义事件名称'); 
  
  // 有自定义传参 
  bus.$emit('自定义事件名称', 数据);
  ```

### 其它常见方式

#### $root

#### $parent

#### $children

#### $refs

[**父直接访问子组件：通过 `ref` 获取子组件**](https://cn.vuejs.org/v2/guide/components-edge-cases.html#%E8%AE%BF%E9%97%AE%E5%AD%90%E7%BB%84%E4%BB%B6%E5%AE%9E%E4%BE%8B%E6%88%96%E5%AD%90%E5%85%83%E7%B4%A0)

* **`ref`** 有两个作用：
  * 在普通 HTML 标签上使用 **`ref`**，获取到的是 DOM
  * 在组件标签上使用 **`ref`**，获取到的是组件实例

* 创建 `child` 组件

  ```vue
  <template>
  <input ref="input" type="text" >
  </template>
  
  <script>
      export default {
          methods: {
              // 用来从父级组件聚焦输入框
              focus () {
                  // 获取 input 标签，对应的 DOM 对象
                  this.$refs.input.focus()
              }
          }
      }
  </script>
  ```

* 在使用子组件的时候，添加 ref 属性：

  ```vue
  <child ref="c"></child>
  ```

* 然后在父组件等渲染完毕后使用 $refs 访问：

  ```js
  mounted () {
      // 等组件渲染完毕，获取子组件对象，操作子组件的方法和属性
      this.$refs.c.focus()
  }
  ```

> $refs 只会在组件渲染完成之后生效，并且它们不是响应式的。这仅作为一个用于直接操作子组件的“逃生舱”——你应该避免在模板或计算属性中访问 $refs 。

## [简易的状态管理方案](https://cn.vuejs.org/v2/guide/state-management.html)

* 如果多个组件之间要共享状态(数据)，使用上面的方式虽然可以实现，但是比较麻烦，而且多个组件之间互相传值很难跟踪数据的变化，如果出现问题很难定位问题。

* 当遇到多个组件需要共享状态的时候，典型的场景：购物车。如果使用上述的方案都不合适，会遇到以下的**问题**：

  * 多个视图依赖于同一状态。
  * 来自不同视图的行为需要变更同一状态。

* 对于问题一，传参的方法对于多层嵌套的组件将会非常繁琐，并且对于兄弟组件间的状态传递无能为力。

* 对于问题二，我们经常会采用父子组件直接引用或者通过事件来变更和同步状态的多份拷贝。以上的这些模式非常脆弱，通常会导致无法维护的代码。

* 因此，我们为什么不把组件的共享状态抽取出来，以一个全局单例模式管理呢？在这种模式下，我们的组件树构成了一个巨大的“视图”，不管在树的哪个位置，任何组件都能获取状态或者触发行为！

* 我们可以把多个组件的状态，或者整个程序的状态放到一个集中的位置存储，并且可以检测到数据的更改。你可能已经想到了 **`Vuex`**。

* 这里我们先以一种简单的方式来实现

  * 首先，创建一个共享的仓库 store 对象

  ```js
  export default {
      debug: true,
      // state 存储数据
      state: {
          user: {
              name: 'xiaomao',
              age: 18,
              sex: '男'
          }
      },
      // action 当视图和用户交互的时候，进行状态的更改
      setUserNameAction (name) {
          if (this.debug) {
              console.log('setUserNameAction triggered：', name)
          }
          this.state.user.name = name
      }
  }
  ```

  * 把共享的仓库 store 对象，存储到需要共享状态的组件的 data 中

  ```js
  import store from './store'
  export default {
      methods: {
          // 点击按钮的时候通过 action 修改状态
          change () {
              store.setUserNameAction('componentA')
          }
      },
      data () {
          return {
              privateState: {},
              sharedState: store.state
          }
      }
  }
  ```

* 接着，我们继续延伸约定，**组件不允许直接变更属于 store 对象的 state**，而**应执行 action 来分发(dispatch) 事件通知 store 去改变**，这样最终的样子跟 **`Vuex`** 的结构就类似了。

* 这样约定的好处是，能够记录所有 **`store`** 中发生的 **`state`** 变更，同时实现 能做到记录变更、保存状态快照、历史回滚 / 时光旅行的先进的调试工具。

## Vuex 

### 基本介绍

**什么是 Vuex** 

Vuex 是一个专为 Vue.js 应用程序开发的 **状态管理模式**；Vuex 采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。Vuex 也集成到 Vue 的官方调试工具 devtools extension，提供了诸如零配置的 time-travel 调试、状态快照导入导出等高级调试功能。

* Vuex 是专门为 Vue.js 设计的状态管理库
* Vuex 采用集中式的方式存储需要共享的数据
* 从使用角度，它就是一个 JavaScript 库
* Vuex 的作用是进行状态管理，解决复杂组件通信，数据共享
* Vuex 集成到了 devtools 中，提供了 time-travel 时光旅行 / 历史回滚功能。

**什么情况下使用 Vuex**

> 官方文档：
>
> Vuex 可以帮助我们管理共享状态，并附带了更多的概念和框架。这需要对短期和长期效益进行权衡。
>
> 如果您不打算开发大型单页应用，使用 Vuex 可能是繁琐冗余的。确实是如此——如果您的应用够简单，您最好不要使用 Vuex。一个简单的 store 模式就足够您所需了。但是，如果您需要构建一个中大型单页应用，您很可能会考虑如何更好地在组件外部管理状态，Vuex 将会成为自然而然的选择。引用 Redux 的作者 Dan Abramov 的话说就是：Flux 架构就像眼镜：您自会知道什么时候需要它。

当你的应用中具有以下需求场景的时候：

* 多个视图依赖于同一状态
* 来自不同视图的行为需要变更同一状态

建议符合这种场景的业务使用 Vuex 来进行数据管理，例如非常典型的场景：购物车。

**注意：****Vuex** **不要滥用，不符合以上需求的业务不要使用，反而会让你的应用变得更麻烦。**

### [核心概念](https://vuex.vuejs.org/zh/guide/state.html)

![image-20201228165906803](C:\Users\li_sh\AppData\Roaming\Typora\typora-user-images\image-20201228165906803.png)

**示例演示**

**基本结构**

* 导入 Vuex

  `store/index.js`

  ```js
  import Vuex from 'vuex'
  ```

* 注册 Vuex

  `store/index.js`

  ```js
  // 注册 Vuex 插件
  Vue.use(Vuex)
  ```

* 导出 store 对象

  `store/index.js`

  ```js
  export default new Vuex.Store({
      state: {
      },
      getters: {
      },
      mutations: {
      },
      actions: {
      },
      modules: {
      }
  })
  ```

* 注入 $store 到 Vue 实例

  `main.js`

  ```js
  import store from './store'
  
  new Vue({
    store, // store 对象 会注入 Vue 实例中
  }).$mount('#app')
  ```

#### State

* Vuex 使用单一状态树，集中存储所有的状态数据，响应式数据，用一个对象就包含了全部的应用层级状态。

  * 在 `store/index.js` 中，定义 `state` ，用来存储数据状态

  ```js
  export default new Vuex.Store({
      // 在仓库中设置的状态，在任何组件中都可以使用
      state: {
          count: 0,
          msg: 'Hello Vuex'
      }
  })
  ```

* 使用 **`mapState` 函数** 简化 `State` 在视图中的使用，**`mapState` 函数** 返回计算属性

* **`mapState` 函数** 有两种使用的方式：

  * 接收数组参数

  ```js
  // 该方法是 vuex 提供的，所以使用前要先导入 
  import { mapState } from 'vuex' 
  
  // mapState 返回名称为 count 和 msg 的计算属性 
  // 在模板中直接使用 count 和 msg 
  computed: { 
      ...mapState(['count', 'msg'])
  }
  ```

  * 接收对象参数
  * 如果当前视图中已经有了 count 和 msg，如果使用上述方式的话会有命名冲突，解决的方式：

  ```js
  // 该方法是 vuex 提供的，所以使用前要先导入 
  import { mapState } from 'vuex' 
  
  // 通过传入对象，可以重命名返回的计算属性 
  // 在模板中直接使用 num 和 message 
  computed: { 
      ...mapState({ 
          num: state => state.count, 
          message: state => state.msg 
      }) 
  }
  
  // 传入的对象的属性，是最终生成的计算属性的名称
  // 属性值，是映射的状态属性
  computed: { 
  	...mapState({ num: 'count', message: 'msg' })
  }
  ```

#### Getter

* `Getter` 就是 `store` 中的计算属性，当我们需要对数据做处理，再在视图中展示时，使用 `Getter`

  * 在 `store/index.js` 中，定义 getters，用来对数据进行处理

  ```js
  export default new Vuex.Store({
      getters: {
          // 参数：state，要处理的数据状态
          reverseMsg (state) {
          	// 返回处理完毕的结果，跟计算属性一样
              return state.msg.split('').reverse().join('')
          }
      }
  })
  ```

* 使用 **`mapGetters` 函数** 简化视图中的使用

  ```js
  import { mapGetters } from 'vuex'
  
  export default {
      computed: {
          ...mapGetter(['reverseMsg']), 
          // 当存在相同变量名时，需要传入对象的形式，进行改名，
          // 属性值：新的变量名，属性值：映射的状态属性
          ...mapGetter({ 
              // 在模板中使用 reverse 
              reverse: 'reverseMsg' 
          })
      }
  }
  ```

#### Mutation

* 提交 **`mutation`** 是 更改 Vuex 的 `store` 中的 状态 **`state`** 的唯一方法；

* **`mutation`** 必须是**同步操作**的，保证在 `mutation` 中收集到全部的状态修改，方便在 `devtools` 中调试；

* Vuex 中的 `mutation` 非常类似于事件：每个 `mutation` 都有一个字符串的 **事件类型** **(type)** 和 一个 **回调函数** **(handler)**。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 **`state`** 作为第一个参数。

  * 在 `store/index.js` 中，定义 mutations，定义更改状态 **`state`** 的方法

  ```js
  export default new Vuex.Store({
      mutations: {
          // state 参数不需要手动传递
          increate (state, payload) {
              state.count += payload
          }
      }
  })
  ```

  * 模拟点击事件，增加 count 

  ```vue
  <!-- Mutation 的调用要通过 commit，$store.commit() 提交 mutation  -->
  <!-- 参数1：increate 是 mutation 中方法的名字，相当于事件的名称 -->
  <!-- 参数2：2 是方法中除 state 外的其他参数 payload 的值，依次往后 -->
  <button @click="$store.commit('increate', 2)">Mutation</button>
  ```

  * 使用 **`mapMutations` 函数** ，将 **`mutations`** 中的方法，映射到当前组件的 **`methods`** 中

  ```js
  import { mapMutations } from 'vuex'
  
  export default {
      methods: {
          // 把 this.increate() 映射为 this.$store.commit('increate')
          ...mapMutations(['increate'])
      }
  }
  ```

  * 使用 **`mapMutations` 函数** 简化视图中的使用

  ```vue
  <!-- state 参数不需要手动传递，3 代表 payload  -->
  <button @click="increate(3)">Mutation</button>
  ```

* 使用 Mutation 改变状态的好处是，集中的一个位置对状态修改，不管在什么地方修改，都可以追踪到状态的修改。可以实现高级的 time-travel 调试功能。

#### Action

Action 类似于 mutation，不同在于：

* `Action` 提交的是 `mutation`，而不是直接变更状态。也就是说，在执行完异步操作后，如果需要更改状态，则需要提交 `mutation`，进行 `state` 的修改。

* Action 可以包含任意异步操作。

  * 在 `store/index.js` 中，定义 `actions`，利用 `setTimeout` 模拟异步操作

  ```js
  export default new Vuex.Store({
      actions: {
          // context 执行上下文
          // context 与 store 实例具有相同方法和属性
          // 注意：context 不是 store 的实例
          increateAsync (context, payload) {
              setTimeout(() => {
                  context.commit('increate', payload)
              }, 2000)
          }
      }
  })
  ```

  Action 函数接受一个与 store 实例具有相同方法和属性的 `context` 对象，因此你可以调用 `context.commit` 提交一个 mutation，或者通过 `context.state` 和 `context.getters` 来获取 state 和 getters。

  * 模拟点击事件，增加 count 

  ```vue
  <!-- Action 的调用要通过 dispatch -->
  <button @click="$store.dispatch('increateAsync', 5)">Action</button>
  ```

  * 使用 **`mapActions` 函数** ，将 **`actions`** 中的方法，映射到当前组件的 **`methods`** 中

  ```js
  import { mapActions } from 'vuex'
  
  export default {
      methods: {
          // 把 this.increate() 映射为 this.$store.dispatch('increateAsync')
          ...mapActions(['increateAsync'])
      }
  }
  ```

  * 使用 **`mapActions` 函数** 简化视图中的使用

  ```vue
  <button @click="increateAsync(6)">Action</button>
  ```

#### Module

* 由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。
* 为了解决以上问题，Vuex 允许我们将 `store` 分割成**模块（module）**。每个模块拥有自己的 state、mutation、action、getter，甚至是嵌套子模块。

**案例演示**

* 创建 `products` 模块

  ```js
  const state = {
      products: [
          { id: 1, title: 'iPhone 11', price: 8000 },
          { id: 2, title: 'iPhone 12', price: 10000 }
      ]
  }
  const getters = {}
  const mutations = {
      setProducts (state, payload) {
          state.products = payload
      }
  }
  const actions = {}
  
  export default {
      state,
      getters,
      mutations,
      actions
  }
  ```

* 在 `store/index.js` 中，注册模块，将 `products` 和 `cart` 模块挂载到 `store.state` 中

  ```js
  import products from './modules/products'
  import cart from './modules/cart'
  
  export default new Vuex.Store({
      modules: {
          // 会把模块的 mutation 记录到 store 的内部属性 _mutations 中
          products,
          cart
      }
  })
  ```

* 模拟点击事件，增加 count ，提交 `products` 模块中的 mutation

  ```vue
  <!-- 从全局命名空间的 store 中获取 -->
  <!--  $store.state.模块名称.成员名 访问到模块中的成员 -->
  products: {{ $store.state.products.products }} <br />
  <!-- 通过 $store.commit() 直接提交 products 模块中的 mutation -->
  <button @click="$store.commit('setProducts', [])">Mutation</button>
  ```

* 默认情况下，模块内部的 action、mutation 和 getter 是注册在**全局命名空间**的——这样使得多个模块能够对同一 mutation 或 action 作出响应。

* 通过添加 `namespaced: true` 的方式使其成为带命名空间的模块，使模块具有更高的封装度和复用性。

  * 当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名

  ```js
  export default {
      namespaced: true
  }
  ```

  * 使用 `mapState` 、 `mapMutations` 等，将 `state` 、`mutations` 等中的成员，映射到当前组件的 `computed`、`methods`中

  ```js
  import { mapState, mapMutations } from 'vuex'
  
  export default {
      computed: {
          // 参数1：模块名称 (命名空间)，参数2：数组，映射模块中的state
          ...mapState('products', ['products'])
      },
      methods: {
          // 参数1：模块名称(命名空间)，参数2：数组，映射模块中的 mutation
          ...mapMutations('products', ['setProducts'])
      }
  }
  ```

  * 使用 `mapState`、`mapMutations` 等简化视图中的使用

  ```vue
  <!-- 根据命名空间，从模块中获取 -->
  products: {{ products }} <br />
  <button @click="setProducts([])">Mutation</button>
  ```

### 严格模式

* 开启严格模式，仅需在创建 `store` 的时候传入 `strict: true`

  ```js
  const store = new Vuex.Store({
    // ...
    strict: true
  })
  ```

  在严格模式下，无论何时发生状态变更，只要此次变更不是由 mutation 函数引起的，就会抛出错误。这能保证所有的状态变更都能被调试工具跟踪到。

**[开发环境与生产环境](https://vuex.vuejs.org/zh/guide/strict.html#开发环境与发布环境)**

**不要在生产环境下启用严格模式**！严格模式会深度监测状态树来检测不合规的状态变更——请确保在发布环境下关闭严格模式，以避免性能损失。

* 类似于插件，我们可以让构建工具来处理这种情况：

  ```js
  const store = new Vuex.Store({
      // ...
      strict: process.env.NODE_ENV !== 'production'
  })
  ```

# 购物车案例

接下来我们通过一个购物车案例来演示 Vuex 在项目中的使用方式，首先把购物车的项目模板下载下来。

[模板地址](https://github.com/goddlts/vuex-cart-demo-template)

**功能列表**

* 商品列表组件
* 商品列表中弹出框组件
* 购物车列表组件

## 商品列表

### 商品列表功能

* Vuex 中创建两个模块，分别用来记录商品列表和购物车的状态，store 的结构：

  ![image-20201230150816238](C:\Users\li_sh\AppData\Roaming\Typora\typora-user-images\image-20201230150816238.png)

* products 模块，`store/modules/products.js`

  ```js
  import axios from 'axios'
  const state = {
      // 定义所有商品数据
      products: []
  }
  const getters = { }
  const mutations = {
      // 定义方法，修改商品数据
      setProducts (state, payload) {
          state.products = payload
      }
  }
  const actions = {
      // 异步向接口请求商品数据
      async getProducts ({ commit }) {
          const { data } = await axios({
              method: 'GET',
              url: 'http://127.0.0.1:3000/products'
          })
          commit('setProducts', data)
      }
  }
  
  export default {
      namespaced: true,
      state,
      getters,
      mutations,
      actions
  }   
  ```

  

* `store/index.js` 中注册 products.js 模块

  ```js
  import Vue from 'vue'
  import Vuex from 'vuex'
  import products from './modules/products'
  
  Vue.use(Vuex)
  
  export default new Vuex.Store({
      modules: {
          products
      }
  })
  ```

* `views/products.vue` 中实现商品列表的功能

  ```js
  import { mapActions, mapState } from 'vuex'
  export default {
      name: 'ProductList',
      computed: {
          ...mapState('products', ['products'])
      },
      methods: {
      	...mapActions('products', ['getProducts'])
      },
      created () {
          this.getProducts()
      }
  }
  ```

### 添加购物车

* cart 模块实现添加购物车功能，`store/modules/cart.js`

  ```js
  
  const mutations = {
      addToCart (state, product) {
          // 1. cartProducts 中没有该商品，把该商品添加到数组中，并增加 count, isChecked, totalPrice
          // 2. cartProducts 有该商品，让商品数量加1，选中，计算小计
          const prod = state.cartProducts.find(item => item.id === product.id)
  		// 当购物车中已经含有该商品
          if (prod) {
              prod.count++
              prod.isChecked = true
              prod.totalPrice = prod.count * prod.price
          } else {
              state.cartProducts.push({
                  // { id, title, price }
                  ...product,
                  count: 1,
                  isChecked: true,
                  totalPrice: product.price
              })
          }
      }
  }
  ```

* `store/index.js` 中注册 cart 模块

  ```js
  import Vue from 'vue'
  import Vuex from 'vuex'
  import cart from './modules/cart'
  
  Vue.use(Vuex)
  
  export default new Vuex.Store({
      modules: {
          cart
      }
  })
  ```

* `view/products.vue` 中实现添加购物车功能

  ```vue
  <!-- 修改模板 --> 
  <template v-slot="scope"> 
  	<el-button @click="addToCart(scope.row)">加入购物车</el-button> 
  </template> 
  
  <!-- 映射 cart 中的 mutations --> 
  methods: {
  	...mapMutations('cart', ['addToCart']),
  }
  ```

* 测试，通过 vue-devtools 观察数据的变化

## 商品列表 - 弹出购物车窗口

**购物车列表**

* components/pop-cart.vue 中展示购物车列表

  ```js
  import { mapState } from 'vuex'
  
  export default {
      name: 'PopCart',
      computed: {
          ...mapState('cart', ['cartProducts'])
      }
  }
  ```

**删除**

* cart 模块实现从购物车删除的功能，`store/modules/cart.js`

  ```js
  const mutations = {
      // 从购物车中删除
      deleteFromCart (state, productId) {
          const index = state.cartProducts.find(item => item.id === productId)
          index !== -1 && state.cartProducts.splice(index, 1)
      }
  }
  ```

* `components/pop-cart.vue` 中实现删除功能

  ```vue
  <template v-slot="scope"> 
  	<el-button @click="deleteFromCart(scope.row.id)" size="mini" >删除</el-button> 
  </template>
  ```

  ```js
   methods: {   
       ...mapMutations('cart', ['deleteFromCart']) 
   }
  ```

**小计**

* cart 模块实现统计总数和总价，`store/modules/cart.js`

  ```js
  const getters = {
      totalCount (state) {
          return state.cartProducts.reduce((sum, prod) => sum + prod.count, 0)
      },
      totalPrice (state) {
          return state.cartProducts.reduce((sum, prod) => sum + prod.totalPrice, 0)
      }
  }
  ```

* `components/pop-cart.vue` 中显示徽章和小计

  ```vue
  <div>
      <p>共 {{ totalCount }} 件商品 共计¥{{ totalPrice }}</p>
      <el-button size="mini" type="danger" @click="$router.push({ name: 'cart' })">去购物车</el-button>
  </div>
  <el-badge :value="totalCount" class="item" slot="reference">
      <el-button type="primary">我的购物车</el-button>
  </el-badge>
  ```

**购物车**

**购物车列表**

省略...

**全选功能**

<<<<<<< HEAD
* cart 模块实现更新商品的选中状态，`store/modules/cart.js`

  ```js
  const mutations = {
      // 更新所有商品的选中状态（点击全选）
      // 改变所有商品的 isChecked 属性
      updateAllProductChecked (state, checked) {
          // checked 当前 checkbox 的状态
          state.cartProducts.forEach(item => {
              item.isChecked = checked
          })
      },
      // 更新某个商品的选中状态（点击单个商品）
      updateProductChecked (state, {
          checked,
          prodId
      }) {
          const prod = state.cartProducts.find(prod => prod.id === prodId)
          prod && (prod.isChecked = checked)
      }
  }
  ```

* `views/cart.vue`，实现全选功能

  * [使用事件抛出一个值]([https://cn.vuejs.org/v2/guide/components.html#%E4%BD%BF%E7%94%A8%E4%BA%8B%E4%BB%B6%E6%8A%9B%E5%87%BA%E4%B8%80%E4%B8%AA%E5%80%BC](https://cn.vuejs.org/v2/guide/components.html#使用事件抛出一个值))
  
  ```vue
  <el-checkbox v-model="checkedAll" size="mini"></el-checkbox>
  <!--
      @change="updateProductChecked"  默认参数：更新后的值
      @change="updateProductChecked(productId, $event)"  123, 原来那个默认参数
      当你传递了自定义参数的时候，还想得到原来那个默认参数，就手动传递一个 $event
  -->
  <template v-slot="scope">
  	<el-checkbox
  		size="mini"
  		:value="scope.row.isChecked"
  		@change="updateProductChecked({
  			checked: $event,
  			prodId: scope.row.id,
  			})"
  		>
  	</el-checkbox>
  </template>
  ```
  
  ```js
  computed: {
      ...mapState('cart', ['cartProducts']),
  	checkedAll: {
  		get () {
  			return this.cartProducts.every((prod) => prod.isChecked)
  		},
  		set (value) {
  			this.updateAllProductChecked(value)
  		}
  	}
  },
  methods: {
  	...mapMutations('cart', [
  		'updateAllProductChecked',
  		'updateProductChecked'
  	])
  }
  ```
=======
* cart 模块实现更新商品的选中状态，store/modules/cart.js

  

* views/cart.vue，实现全选功能

  * 使用事件抛出一个值
>>>>>>> ae983c3a3a464377454724feeb95c6a46557fd16

**数字文本框**

* cart 模块实现更新商品数量，`store/modules/cart.js`

<<<<<<< HEAD
  ```js
  const mutations = {
      updateProduct (state, {
          prodId,
          count
      }) {
          const prod = state.cartProducts.find(prod => prod.id === prodId)
          if (prod) {
              prod.count = count
              prod.totalPrice = count * prod.price
          }
      }
  }
  ```

* `views/cart.vue`，实现数字文本框功能

  ```vue
  <template v-slot="scope">
  	<el-input-number :value="scope.row.count" @change="updateProduct({
                                                     prodId: scope.row.id,
                                                     count: $event
                                                     })" size="mini">
      </el-input-number>
  </template>
  ```

  ```js
  methods: {
      ...mapMutations('cart', [
          'updateAllProductChecked',
          'updateProductChecked',
          'updateProduct'
      ])
  }
  ```
=======
  

* views/cart.vue，实现数字文本框功能
>>>>>>> ae983c3a3a464377454724feeb95c6a46557fd16

**删除**

省略...

**小计**

<<<<<<< HEAD
* cart 模块实现统计选中商品价格和数量，`store/modules/cart.js`
  
```js
  const getters = {
      checkedCount (state) {
          return state.cartProducts.reduce((sum, prod) => {
              if (prod.isChecked) {
                  sum += prod.count
              }
              return sum
          }, 0)
      },
      checkedPrice (state) {
          return state.cartProducts.reduce((sum, prod) => {
              if (prod.isChecked) {
                  sum += prod.totalPrice
              }
              return sum
          }, 0)
      }
  }
  ```
  
* `views/cart.vue`，实现小计

  ```vue
  <p>已选 <span> {{ checkedCount }} </span> 件商品，总价：<span> {{ checkedPrice.toFixed(2) }} </span></p>
  ```

  ```js
  ...mapGetters('cart', ['checkedCount', 'checkedPrice'])
  ```

**Vuex 插件**

* Vuex 的插件就是一个函数，让其在所有的 mutation 结束之后再执行。
* 这个函数接收一个 store 的参数

**Vuex 插件使用**

```js
const myPlugin = store => {
    // 当 store 初始化后调用
    // store 中的 subscribe，订阅 store 中的 mutation
    store.subscribe((mutation, state) => {
        // 每次 mutation 之后调用
        // mutation 的格式为 { type, payload }
    })
}
```

插件要在创建 store 之前进行创建

```js
export default new Vuex.Store({
    ......
    plugins: [myPlugin] // 注册插件
})
```

**插件中的 mutation**

![image-20210104144409947](C:\Users\86135\AppData\Roaming\Typora\typora-user-images\image-20210104144409947.png)

**本地存储**

当在购物车页面刷新时，会发现没有数据，在这里需要使用 `localStorage` ，将购物车中的商品信息存储在本地

* 初始进入购物车时，先从本地读取商品信息，若没有，默认为空数组，`store/modules/cart.js`

  ```js
  const state = {
    // 记录所有的购物车数据
    cartProducts: JSON.parse(window.localStorage.getItem('cart-products')) || []
  }
  ```

* 利用 Vuex 的插件机制，当购物车中的商品信息被更改时，实时更新本地存储中的商品信息

  ```js
  // 定义插件
  const myPlugin = store => {
      // 订阅 store 中的 mutation ，每次 mutation 之后调用
      store.subscribe((mutation, state) => {
          // 只处理 cart 中的 mutation
          if (mutation.type.startsWith('cart/')) {
              window.localStorage.setItem('cart-products', state.cartProducts)
          }
      })
  }
  
  export default new Vuex.Store({
  	......
      // 注册插件
      plugins: [myPlugin]
  })
  ```

**严格模式**

**Vuex 模拟实现**

回顾基础示例，自己模拟实现一个 Vuex 实现同样的功能

* `src/store/index.js`

```js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        count: 0,
        msg: 'Hello World'
    },
    getters: {
        reverseMsg (state) {
            return state.msg.split('').reverse().join('')
        }
    },
    mutations: {
        increate (state, payload) {
            state.count += payload
        }
    },
    actions: {
        increateAsync (context, payload) {
            setTimeout(() => {
                context.commit('increate', payload)
            }, 2000)
        }
    }
})
```
=======
* cart 模块实现统计选中商品价格和数量，store/modules/cart.js
  

* `views/cart.vue`，实现小计

**本地存储**

**Vuex** **插件**

**严格模式**

**Vuex** **模拟实现**

回顾基础示例，自己模拟实现一个 Vuex 实现同样的功能


>>>>>>> ae983c3a3a464377454724feeb95c6a46557fd16

**实现思路**

* 实现 install 方法
  * Vuex 是 Vue 的一个插件，所以和模拟 VueRouter 类似，先实现 Vue 插件约定的 install 方法
* 实现 Store 类
  * 实现构造函数，接收 options
  * state 的响应化处理
  * getter 的实现
  * commit、dispatch 方法

**install** **方法**

<<<<<<< HEAD
* `src/myvuex/index.js`

```js
// Vue 插件的 install 方法
let _Vue = null
function install (Vue) {
    _Vue = Vue
    Vue.mixin({
        beforeCreate () {
            // this 指 Vue 实例
            // $options 指 创建 Vue 实例时，传入的参数
            if (this.$options.store) {
                // 将 store 注入到所有的 Vue 实例中
                _Vue.prototype.$store = this.$options.store
            }
        }
    })
}
```

**Store** **类** 

* `src/myvuex/index.js`

  ```js
  class Store {
      constructor (options) {
          const { 
              state = {}, // 防止用户没有传入，设置默认值
              getters = {}, 
              mutations = {}, 
              actions = {}
          } = options
  
          // 将 state 设置成响应式的
          this.state = _Vue.Observable(state)
          /**
           * 此处不直接 this.getters = getters，是因为下面的代码中要 getters 中的 key
           * 如果这么写的话，会导致 this.getters 和 getters 指向同一个对象
           * 当访问 getters 的 key 的时候，实际上就是访问 this.getters 的 key，会触发 key 属性的 getter
           * 会产生死递归
           */ 
          this.getters = Object.create(null)
          Object.keys(getters).forEach(key => {
              Object.defineProperty(this.getters, key, {
                  get: () => getters[key](state)
              })
          })
          // 私有属性
          this._mutations = mutations
          this._actions = actions
      }
  
      // 提交 mutation
      commit (type, payload) {
          this._mutations[type](this.state, payload)
      }
  
      // 分发 actions
      dispatch (type, payload) {
          this._actions[type](this, payload)
      }
  }
  
  // 导出模块
  export default {
      Store,
      install
  }
  ```

=======
**Store** **类** 

>>>>>>> ae983c3a3a464377454724feeb95c6a46557fd16
**使用自己实现的** **Vuex**

* `src/store/index.js` 中修改导入 Vuex 的路径，测试

<<<<<<< HEAD
  ```js
  import Vuex from '../myvuex'
  // 注册插件
  Vue.use(Vuex)
  ```

  

=======
>>>>>>> ae983c3a3a464377454724feeb95c6a46557fd16


