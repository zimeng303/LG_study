@[TOC](封装 Vue.js 组件库)

# 课程目标

## 开源组件库

* Element-UI
* iView

## CDD

**基本介绍**

* CDD(Component-Driven Development) ：组件驱动开发
  * 自上而下
  * 从组件级别开始，到页面级别结束

**CDD 的好处**

* 组件在最大程度被重用
* 并行开发
* 可视化测试

# 基础回顾

## 处理组件的边界情况

* $root

* $parent/$children

* $refs

  ![image-20210127172944425](F:\LaGou\03-module\04-min-module\assets\image-20210127172944425.png)

* 依赖注入 provide / inject

  * 方便获取最外层的成员
  * 通过依赖注入的成员，不是响应式的，应该避免修改注入（inject）进来的成员

## $attrs / $listeners

* $attrs
  * 把父组件中非 prop 属性绑定到内部组件
* $listeners
  * 把父组件中的 DOM 对象的原生事件绑定到内部组件

# 快速原型开发

* VueCLI 中提供了一个插件可以进行原型快速开发

* 需要先额外安装一个全局的插件 `@vue/cli-service-global`

  ```powershell
  npm install -g @vue/cli-service-global
  ```

* 使用 `vue serve` 快速查看组件的运行效果

**vue serve**

* `vue serve` 如果不指定参数，默认会在当前目录找以下的入口

  * `main.js`、`index.js`、`App.vue`、`app.vue`

* 可以指定要加载的组件

  ```powershell
  # vue serve 组件路径
  vue serve ./src/login.vue
  ```

**ElementUI**

* 初始化 package.json

  ```powershell
  npm init -y
  ```

* 安装 ElementUI

  ```powershell
  vue add element
  ```

* 加载 ElementUI，使用 Vue.use() 安装插件

  ```js
  import ElemnetUI from 'element-ui'
  import 'element-ui/lib/theme-chalk/index.css'
  
  Vue.use(ElemnetUI)
  ```

# 组件开发

## 组件分类

* 第三方组件
* 基础组件
* 业务组件

## 步骤条组件

![image-20210128155255399](F:\LaGou\03-module\04-min-module\assets\image-20210128155255399.png)

* 样式文件 `steps.css`

  ```css
  .lg-steps {
      position: relative;
      display: flex;
      justify-content: space-between;
  }
  
  .lg-steps-line {
      position: absolute;
      height: 2px;
      top: 50%;
      left: 24px;
      right: 24px;
      transform: translateY(-50%);
      z-index: 1;
      background: rgb(223, 231, 239);
  }
  
  .lg-step {
      border: 2px solid;
      border-radius: 50%;
      height: 32px;
      width: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 700;
      z-index: 2;
      background-color: white;
      box-sizing: border-box;
  }
  ```

* 组件文件 `Steps.vue`

  ```html
  <template>
      <div class="lg-steps">
          <div class="lg-steps-line"></div>
          <div 
               class="lg-step"
               v-for="index in count"
               :key="index"
               :style="{ color: active >= index ? activeColor : defaultColor}"
               >
              {{ index }}
          </div>
      </div>
  </template>
  
  <script>
      import './steps.css'
      export default {
          name: 'LgSteps',
          props: {
              count: {
                  type: Number,
                  default: 3
              },
              active: {
                  type: Number,
                  default: 0
              },
              activeColor: {
                  type: String,
                  default: 'red'
              },
              defaultColor: {
                  type: String,
                  default: 'blue'
              }
          }
      }
  </script>
  ```

* 测试文件（父组件）`Steps-test.vue`

  ```html
  <template>
      <div>
          <steps :count="count" :active="active"></steps>
          <hr />
          <button @click="next">下一步</button>
      </div>
  </template>
  
  <script>
      import Steps from './Steps'
      export default {
          components: {
              Steps
          },
          data () {
              return {
                  count: 4,
                  active: 0
              }
          },
          methods: {
              next () {
                  this.active < this.count && this.active++
              }
          }
      }
  </script>
  ```

* 使用 `vue serve` 快速查看组件的运行效果

  ```powershell
  vue serve src/Steps-test.vue
  ```

* 访问 [http://localhost:8080](http://localhost:8080)，查看组件的使用效果，如图所示：

  ![image-20210128155749750](F:\LaGou\03-module\04-min-module\assets\image-20210128155749750.png)

## 表单组件

### 展示功能

**整体结构**

![image-20210128162213302](F:\LaGou\03-module\04-min-module\assets\image-20210128162213302.png)

**展示效果**

![image-20210128163017063](F:\LaGou\03-module\04-min-module\assets\image-20210128163017063.png)

### 代码实现

* 模拟 `el-form` 组件，文件：`Form.vue`

  ```html
  <template>
      <form>
          <slot />
      </form>
  </template>
  
  <script>
      export default {
          name: 'LgForm',
          provide () {
              return {
                  form: this
              }
          },
          props: {
              model: {
                  type: Object
              },
              rules: {
                  type: Object
              }
          },
      }
  </script>
  ```

* 模拟 `el-form-item` 组件，文件：`FormItem.vue`

  ```html
  <template>
      <div>
          <label>{{ label }}</label>
          <div>
              <slot />
              <p v-if="errMessage">{{ errMessage }}</p>
          </div>
      </div>
  </template>
  
  <script>
      export default {
          name: 'LgFormItem',
          inject: ['form'],
          props: {
              label: {
                  type: String
              },
              prop: {
                  type: String
              }
          },
          data () {
              return {
                  errMessage: ''
              }
          },
      }
  </script>
  ```

* 模拟 `el-input` 组件，文件：`Input.vue`

  ```html
  <template>
    <div>
        <input v-bind="$attrs" :type="type" :value="value">
    </div>
  </template>
  
  <script>
  export default {
      name: 'LgInput',
      inheritAttrs: false, // 禁用继承父组件中传入的属性
      props: {
          value: {
              type: String
          },
          type: {
              type: String,
              default: 'text'
          }
      },
  }
  </script>
  ```

* 模拟 `el-button` 组件，文件：`Button.vue`

  ```html
  <template>
      <div>
          <button :type="type" @click="handleClick">
              <slot />
          </button>
      </div>
  </template>
  
  <script>
      export default {
          name: 'LgButton',
          methods: {
              handleClick (evt) {
                  this.$emit('click', evt)
                  evt.preventDefault()
              }
          }
      }
  </script>
  ```

**表单验证**

ElementUI 中的表单验证，是使用了 `async-validator` 模块

* 安装 `async-validator`

  ```powershell
  npm i async-validator
  ```

**Input 组件验证**

* Input 组件中触发自定义事件 validate

  * `Input.vue`

  ```html
  <input v-bind="$attrs" :type="type" :value="value" @input="handleInput">
  
  <script>
      export default {
          methods: {
              handleInput (evt) {
                  this.$emit('input', evt.target.value)
  
                  const findParent = parent => {
                      while (parent) {
                          if (parent.$options.name === 'LgFormItem') {
                              break
                          } else {
                              parent = parent.$parent
                          }
                      }
                      return parent
                  }
                  const parent = findParent(this.$parent)
                  if (parent) {
                      parent.$emit('validate')
                  }
              }
          }
      }
  </script>
  ```

* FormItem 渲染完毕注册自定义事件 validate

  * `FormItem.vue`

  ```html
  <script>
  import AsyncValidator from 'async-validator'
  export default {
      mounted () {
          this.$on('validate', () => {
              this.validate()
          })
      },
      methods: {
          validate () {
              if (!this.prop) return
              const value = this.form.model[this.prop] 
              const rules = this.form.rules[this.prop]
  
              const descriptor = { [this.prop]: rules }
              const validator = new AsyncValidator(descriptor)
              return validator.validate({ [this.prop]: value }, errors => {
                  if (errors) {
                      this.errMessage = errors[0].message
                  } else {
                      this.errMessage = ''
                  }
              })
          }
      }
  }
  </script>
  ```

* Form 定义事件 validate

  * `Form.vue`

  ```js
  methods: {
      validate (cb) {
          const tasks = this.$children
              .filter(child => child.prop)
              .map(child => child.validate())
  
          Promise.all(tasks)
              .then(() => cb(true))
              .catch(() => cb(false))
      }
  }
  ```

# Monorepo -- 组件管理方式之一

## 两种项目的组织方式

* Multirepo(Multiple Repository)
  * 每一个包对应一个项目
* Monorepo(Monolithic Repository)
  * 一个项目仓库中管理多个模块/包

## Monorepo 目录结构

![image-20210131164658273](F:\ReactJs\01-basic\assets\image-20210131163220899.png)

* `packages` 文件夹：存放所有要开发的组件，每一个组件对应一个文件夹，每一个文件夹就是一个包，它可以单独发布到 npm 中

* `button` 文件夹：创建的组件名

* `__test__` 文件夹：存放测试的文件

* `dist` 文件夹：打包目录

* `src` 文件夹：存放源码，*.vue 文件存放的位置

* `index.js` 文件：打包的入口，使用组件，并将组件导出

  ```js
  import Button from './src/button.vue'
  // 安装插件时，进行调用
  Button.install = Vue => {
      Vue.component(Button.name, Button)
  }
  
  export default Button
  ```

* `LICENSE` 文件：存放版权信息（本次采用 MIT 协议）

* `package.json` 文件：包的描述信息，包的名称和版本

* `README.md` 文件：文档

# Storybook -- UI组件的开发环境

## 基本介绍

* 可视化的组件展示平台
* 在隔离的开发环境中，以交互式的方式展示组件
* 在主程序之外运行，独立开发组件
* 支持的框架
  * React、React Native、Vue、Angular
  * Ember、HTML、Svelte、Mithril、Riot
* 官网地址：[https://storybook.js.org/](https://storybook.js.org/)
* GitHub 地址：[https://github.com/storybookjs/storybook](https://github.com/storybookjs/storybook)

## 基本使用

* **自动安装**

  ```powershell
  npx -p @storybook/cli sb init --type vue
  yarn add vue
  yarn add vue-loader vue-template-compiler --dev
  ```

  > `--type` 标志来指示 **Storybook** 根据该标志进行自身配置。

* 启动服务，并访问

  ```powershell
  npm run storybook
  # yarn storybook
  ```

  ![image-20210201083917521](F:\ReactJs\01-basic\assets\image-20210201083917521.png)

* 项目构建

  ```powershell
  npm run build-storybook
  # yarn build-storybook
  ```

  ![image-20210201084043265](F:\ReactJs\01-basic\assets\image-20210201084043265.png)

## 基本案例

* 1，在根目录创建 `packages` 文件夹，用于存放组件，一个文件夹代表一个组件，目录结构，如下图所示：

  ![image-20210202104134654](F:\ReactJs\01-basic\assets\image-20210202104134654.png)

* 2，组件的 `*.vue` 存放在 `src` 目录下，如图所示：

  ![image-20210202104406607](F:\ReactJs\01-basic\assets\image-20210202104406607.png)

* 3，在每一个组件中，分别创建一个 `stories/*.stories.js` 文件，用于存放 [默认导出](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export#Using_the_default_export) 描述组件，以及 [命名出口](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export#Using_named_exports) 描述 `storybook`

  * `package/input/stories/input.stories.js`

  ```js
  import LgInput from '../'
  
  // Storybook lists your stories and provides information used by addons
  export default {
      title: 'LgInput',
      component: LgInput
  }
  
  // 渲染组件，设置组件模板
  export const Text = () => ({
      components: { LgInput },
      template: '<lg-input></lg-input>',
      data () {
          return {
              value: 'admin'
          }
      }
  })
  
  export const Password = () => ({
      components: { LgInput },
      template: '<lg-input type="password" v-model="value"></lg-input>',
      data () {
          return {
              value: 'admin'
          }
      }
  })
  ```

  * `package/form/stories/form.stories.js`

  ```js
  import LgForm from '../'
  import LgFormItem from '../../formitem'
  import LgInput from '../../input'
  import LgButton from '../../button'
  
  export default {
      title: 'LgForm',
      component: LgForm
  }
  
  export const Login = () => ({
      components: { LgForm, LgFormItem, LgInput, LgButton },
      template: `
  <lg-form class="form" ref="form" :model="user" :rules="rules">
  <lg-form-item label="用户名" prop="username">
  <lg-input :value="user.username" @input="user.username=$event" placeholder="请输入用户名"></lg-input>
  </lg-form-item>
  <lg-form-item label="密码" prop="password">
  <lg-input type="password" v-model="user.password"></lg-input>
  </lg-form-item>
  <lg-form-item>
  <lg-button type="primary" @click="login">登 录</lg-button>
  </lg-form-item>
  </lg-form>
  `,
      data() {
          return {
              user: {
                  username: '',
                  password: ''
              },
              rules: {
                  username: [
                      {
                          required: true,
                          message: '请输入用户名'
                      }
                  ],
                  password: [
                      {
                          required: true,
                          message: '请输入密码'
                      },
                      {
                          min: 6,
                          max: 12,
                          message: '请输入6-12位密码'
                      }
                  ]
              }
          }
      },
      methods: {
          login() {
              console.log('button')
              this.$refs.form.validate(valid => {
                  if (valid) {
                      alert('验证成功')
                  } else {
                      alert('验证失败')
                      return false
                  }
              })
          }
      }
  })
  ```

> 注意：
>
> ​	此处引入了 `formitem` 组件，由于 `formitem` 组件依赖于 `async-validator` 包，因此，需要在 `formitem`  组件中安装  `async-validator` 包，否则会报错

* 4，修改 `storybook` 的配置文件 `./storybook/main.js`

  ```js
  module.exports = {
      "stories": ["../packages/**/*.stories.js"],
      "addons": [
          "@storybook/addon-links",
          "@storybook/addon-essentials"
      ]
  }
  ```

* 5，启动服务，测试组件

  ```powershell
  npm run storybook
  # yarn storybook
  ```

* 6，访问网址，如图所示：

  ![image-20210202110011552](F:\ReactJs\01-basic\assets\image-20210202110011552.png)

# yarn workspace

**项目依赖**

![image-20210202110653733](F:\ReactJs\01-basic\assets\image-20210202110653733.png)

**基本介绍**

`Yarn Workspaces` 允许用户在单个根 `package.json` 文件的子文件夹中从多个`package.json` 文件中安装依赖。

通过防止 `Workspaces` 中依赖包的重复，使原生 `Workspaces` 到 `Yarn` 可以实现更快更轻松的依赖安装。`Yarn` 还可以在依赖于彼此的 `Workspaces` 之间创建软链接，并确保所有目录的一致性和正确性。

**开启 yarn 的工作区**

* 项目根目录的 `package.json`

  ```json
  {
      "private": true,
      "workspaces": ["packages/*"],
  }
  ```

  > `"private": true`：将项目提交到 GitHub 或 NPM 的时候，禁止把当前根目录的内容进行提交
  >
  > `"workspaces": []`：存放所有要管理的包路径

**基本使用**

* 给工作区根目录安装开发依赖

  ```powershell
  yarn add jest-D -W
  ```

  > * `jest`：FaceBook 发布的单元测试工具 
  > * `-D`：开发依赖
  > * `-W`：工作区，指的是安装到工作区的根目录

* 给指定工作区安装依赖

  ```powershell
  yarn workspace lg-button add lodash@4
  ```

  > `lg-button`：包名，即在 `package.json` 中设置的 `name` 属性

* 给所有的工作区安装依赖

  ```powershell
  yarn install
  ```

**总结**

![image-20210202113903230](F:\ReactJs\01-basic\assets\image-20210202113903230.png)

重复的依赖包会提升到根目录下的 `node_modules` 目录中，单独的依赖会安装到对应的组件的 `node_modules` 目录中，方便管理依赖。

# Lerna 

## 基本介绍

* Lerna 是一个优化使用 git 和 npm 管理多包仓库的工作流工具
* 用于管理具有多个包的 JavaScript 项目
* 它可以一键把代码提交到git和npm仓库

## 基本使用

* 全局安装

  ```powershell
  yarn global add lerna
  ```

* 初始化

  ```powershell
  lerna init
  ```

* 发布

  ```powershell
  lerna publish
  ```

* 清理项目中的 `node_modules`

  ```powershell
  lerna clean
  ```

> <font color="#f00">注意：</font>
>
> * 在发布之前，需要建立远端 Git 仓库，并且连接本地项目

* 在发布之前，还需要 注册 / 登录 npm

  ```powershell
  # 注册
  npm adduser
  
  # 登录
  npm login
  ```

  登录结果，如图所示：

  ![image-20210202143251160](F:\ReactJs\01-basic\assets\image-20210202143251160.png)

  查看登录账户，如下所示：

  ```powershell
  npm whoami
  ```

  ![image-20210202143411662](F:\ReactJs\01-basic\assets\image-20210202143411662.png)

* 查看当前的镜像源

  ```powershell
  npm config get registry
  ```

  查看是否是npm官网，如果不是的话，需要将镜像源修改回来

  ![image-20210202142830517](F:\ReactJs\01-basic\assets\image-20210202142830517.png)

# Vue 组件的单元测试

## 组件单元测试的好处

* 提供描述组件行为的文档
* 节省手动测试的时间
* 减少研发新特性时产生的bug
* 改进设计
* 促进重构

## 安装依赖

* `Vue Test Utils`：Vue提供的组件单元测试官方库，需要结合单元测试框架一起使用

* `Jest`：FaceBook 开发的单元测试框架

* `vue-jest`：预处理器

* `babel-jest`：对测试代码进行降级处理，即将 ES6 语法转换为 ES5等

* 安装

  ```powershell
  yarn add jest @vue/test-utils vue-jest babel-jest -D -W
  ```

## 配置测试脚本

* `package.json`

  ```json
  "scripts": {
      "test": "jest"
  }
  ```

## Jest 配置文件

* `jest.config.js`

  ```js
  module.exports = {
      // 用哪里找测试文件
      "testMatch": ["**/__tests__/**/*.[jt]s?(x)"],
      // 测试文件中导入的模块后缀
      "moduleFileExtensions": [
          "js",
          "json",
          // 告诉 Jest 处理 `*.vue` 文件
          "vue"
      ],
      "transform": {
          // 用 `vue-jest` 处理 `*.vue` 文件
          ".*\\.(vue)$": "vue-jest",
          // 用 `babel-jest` 处理 js
          ".*\\.(js)$": "babel-jest"
      }
  }
  ```

## Babel 配置文件

* `babel.config.js`

  ```js
  module.exports = {
      presets: [
          [
              '@babel/preset-env'
          ]
      ]
  }
  ```

Babel 桥接

* 安装 Babel 的桥接依赖

  ```powershell
  yarn add babel-core@bridge -D -W
  ```

## Jest 常用 API

* 全局函数
  * describe(name, fn)                  把相关测试组合在一起
  * test(name, fn)                          测试方法
  * expect(value)                           断言
* 匹配器
  * toBe(value)                              判断值是否相等
  * toEqual(obj)                             判断对象是否相等
  * toContain(value)                      判断数组或者字符串中是否包含
  * ......
* 快照
  * toMatchSnapshot()

## Vue Test Utils 常用 API

* mount()
  * 创建一个包含被挂载和渲染的 Vue 组件的 Wrapper
* Wrapper 
  * vm                                             wrapper 包裹的组件实例
  * props()                                       返回 Vue 实例选项中的 props 对象
  * html()                                         组件生成的 HTML 标签
  * find()                                          通过选择器返回匹配到的组件中的 DOM 元素
  * trigger()                                      触发 DOM 原生事件，自定义事件 wrapper.vm.$emit()
  * ......

## 编写测试文件

* `__tests__/input.test.js`

  ```js
  import input from '../src/input.vue'
  import { mount } from '@vue/test-utils'
  
  describe('lg-input', () => {    
      test('input-text', () => {
          const wrapper = mount(input)
          expect(wrapper.html()).toContain('input type="text"')
      })
  
      test('input-password', () => {
          const wrapper = mount(input, {
              propsData: {
                  type: "password"
              }
          })
          expect(wrapper.html()).toContain('input type="password"')
      })
  
      test('input-password', () => {
          const wrapper = mount(input, {
              propsData: {
                  type: "password",
                  value: 'admin'
              }
          })
          expect(wrapper.props('value')).toBe('admin')
      })
  
      test('input-snapshot', () => {
          const wrapper = mount(input, {
              propsData: {
                  type: "password",
                  value: 'admin'
              }
          })
          expect(wrapper.vm.$el).toMatchSnapshot()
      })
  })
  ```

  执行 `yarn test`，测试结果，如图所示：

  ![image-20210202154359188](F:\LaGou\03-module\04-min-module\assets\image-20210202154359188.png)

  生成的快照文件，如图所示：

  ![image-20210202154503842](F:\LaGou\03-module\04-min-module\assets\image-20210202154503842.png)

# Rollup

## 基本介绍

* Rollup 是一个模块打包器
* Rollup 支持 Tree-shaking
* 打包的结果比 Webpack 要小
* 开发框架／组件库的时候使用 Rollup 更合适

## 安装依赖

* Rollup

* rollup-plugin-terser：对代码进行压缩

* rollup-plugin-vue@5.1.9：把单文件组件编译成 js 代码，注意：一定要指定版本

* vue-template-compiler：编译器

* 安装

  ```powershell
  yarn add rollup rollup-plugin-terser rollup-plugin-vue@5.1.9 vue-template-compiler -D -W
  ```

## Rollup 配置文件

* 在 button 目录中创建 `rollup.config.js`

  ```js
  import { terser } from 'rollup-plugin-terser'
  import vue from 'rollup-plugin-vue'
  
  module.exports = [
      {
          input: 'index.js',
          output: [
              {
                  file: 'dist/index.js',
                  format: 'es'
              }
          ],
          plugins: [
              vue({
                  // Dynamically inject css as a <style> tag
                  css: true, 
                  // Explicitly convert template to render function
                  compileTemplate: true
              }),
              terser()
          ]
      }
  ]
  ```

## 打包命令

**打包单个组件**

* 组件目录的 `package.json` 中配置 `scripts`

  ```json
  "scripts": {
      "build": "rollup -c"
  }
  ```

* 进入 `button` 目录下，执行打包命令

  ```powershell
  yarn workspace alison-button run build
  ```

**打包所有组件**

* 安装依赖

  ```powershell
  yarn add @rollup/plugin-json rollup-plugin-postcss @rollup/plugin-node-resolve -D -W
  ```

* 项目根目录创建 `rollup.config.js`

  ```js
  import fs from 'fs'
  import path from 'path'
  import json from '@rollup/plugin-json'
  import vue from 'rollup-plugin-vue'
  import postcss from 'rollup-plugin-postcss'
  import { terser } from 'rollup-plugin-terser'
  import { nodeResolve } from '@rollup/plugin-node-resolve'
  
  const isDev = process.env.NODE_ENV !== 'production'
  
  // 公共插件配置
  const plugins = [
      vue({
          // Dynamically inject css as a <style> tag
          css: true,
          // Explicitly convert template to render function
          compileTemplate: true
      }),
      json(),
      nodeResolve(),
      postcss({
          // 把 css 插入到 style 中
          // inject: true,
          // 把 css 放到和js同一目录
          extract: true
      })
  ]
  
  // 如果不是开发环境，开启压缩
  isDev || plugins.push(terser())
  
  // packages 文件夹路径
  const root = path.resolve(__dirname, 'packages')
  
  module.exports = fs.readdirSync(root)
  // 过滤，只保留文件夹
      .filter(item => fs.statSync(path.resolve(root, item)).isDirectory())
  // 为每一个文件夹创建对应的配置
      .map(item => {
      const pkg = require(path.resolve(root, item, 'package.json'))
      return {
          input: path.resolve(root, item, 'index.js'),
          output: [
              {
                  exports: 'auto',
                  file: path.resolve(root, item, pkg.main),
                  format: 'cjs'
              },
              {
                  exports: 'auto',
                  file: path.join(root, item, pkg.module),
                  format: 'es'
              },
          ],
          plugins: plugins
      }
  })
  ```

* 在每一个包中设置 `package.json` 中的 `main` 和 `module` 字段

  ```js
  {
      "main": "dist/cjs/index.js",
  	"module": "dist/es/index.js"
  }
  ```

* 根目录的 `package.json` 中配置 `scripts`

  ```json
  "scripts": {
      "build": "rollup -c"
  }
  ```

* 根目录下，启动服务

  ```powershell
  yarn build
  ```

# 设置环境变量

* 安装 `cross-env`

  ```powershell
  yarn add cross-env -D -W
  ```

* 根目录的 `package.json` 中配置 `scripts`

  ```json
  "scripts": {
      "build:prod": "cross-env NODE_ENV=production rollup -c",
      "build:dev": "cross-env NODE_ENV=development rollup -c"
  },
  ```

* 启动构建

  ```powershell
  # 生产环境打包
  yarn build:prod
  
  # 开发环境打包
  yarn build:dev
  ```

# 清理指定文件

* 安装 `rimraf`

  ```powershell
  yarn add rimraf -D -W
  ```

* 在每个组件目录的 `package.json` 中配置 `scripts`

  ```json
  "scripts": {
      "del": "rimraf dist"
  },
  ```

  > `dist` ：是指要被删除的目录

* 批量执行每个组件的 `del` 命令

  ```powershell
  yarn workspaces run del
  ```

# 基于模板生成组件结构

使用 plop 创建模板，具体用法，参考网址：[https://blog.csdn.net/zimeng303/article/details/110037847](https://blog.csdn.net/zimeng303/article/details/110037847)

* 安装 `plop` 

  ```powershell
  yarn add plop -D -W
  ```

* 模板目录结构，如图所示：

  ![image-20210202170553918](F:\LaGou\03-module\04-min-module\assets\image-20210202170553918.png)

* `__tests/component.test.hbs`

  ```js
  import { mount } from '@vue/test-utils'
  import Element from '../src/{{name}}.vue'
  
  describe('Lg-{{properCase name}}', () => {
  })
  ```

* `src/component.hbs`

  ```html
  <template>
      <div>
  
      </div>
  </template>
  
  <script>
      export default {
          name: 'Lg{{properCase name}}',
          props: {}
      }
  </script>
  
  <style>
  </style>
  ```

* `stories/component.stories.hbs`

  ```js
  import Lg{{properCase name}} from '../src/{{name}}.vue'
  
  export default {
      title: 'Lg{{properCase name}}',
      component: Lg{{properCase name}}
  }
  
  export const {{properCase name}} = _ => ({
      components: { Lg{{properCase name}} },
      template: `
          <div>
          	<lg-{{name}}></lg-{{name}}>
          </div>
  	`
  })
  ```

* `index.hbs`

  ```js
  import Lg{{properCase name}} from './src/{{name}}.vue'
  
  Lg{{properCase name}}.install = Vue => {
      Vue.component(Lg{{properCase name}}.name, Lg{{properCase name}})
  }
  
  export default Lg{{properCase name}}
  ```

* `LICENSE`，固定写法

  ```markdown
  The MIT License (MIT)
  
  Copyright (c) 2020-present
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
  ```

* `package.hbs`

  ```json
  {
      "name": "lg-{{name}}",
      "version": "0.0.0",
      "description": "lg-{{name}} component",
      "main": "dist/cjs/index.js",
      "module": "dist/es/index.js",
      "license": "MIT",
      "scripts": {
          "test": "echo \"Error: no test specified\" && exit 1"
      },
      "dependencies": {
      },
      "keywords": []
  }
  ```

* 在根目录配置 plop 的配置文件 `plopfile.js`

  ```js
  module.exports = plop => {
      plop.setGenerator('component', {
          description: 'create a custom component',
          prompts: [
              {
                  type: 'input',
                  name: 'name',
                  message: 'component name',
                  default: 'MyComponent'
              }
          ],
          actions: [
              {
                  type: 'add',
                  path: 'packages/{{name}}/src/{{name}}.vue',
                  templateFile: 'plop-template/component/src/component.hbs'
              },
              {
                  type: 'add',
                  path: 'packages/{{name}}/__tests__/{{name}}.test.js',
                  templateFile: 'plop-template/component/__tests__/component.test.hbs'
              },
              {
                  type: 'add',
                  path: 'packages/{{name}}/stories/{{name}}.stories.js',
                  templateFile: 'plop-template/component/stories/component.stories.hbs'
              },
              {
                  type: 'add',
                  path: 'packages/{{name}}/index.js',
                  templateFile: 'plop-template/component/index.hbs'
              },
              {
                  type: 'add',
                  path: 'packages/{{name}}/LICENSE',
                  templateFile: 'plop-template/component/LICENSE'
              },
              {
                  type: 'add',
                  path: 'packages/{{name}}/package.json',
                  templateFile: 'plop-template/component/package.hbs'
              },
              {
                  type: 'add',
                  path: 'packages/{{name}}/README.md',
                  templateFile: 'plop-template/component/README.hbs'
              }
          ]
      })
  }
  ```

* 在根目录的 `package.json` 中配置 `scripts`

  ```json
  "scripts": {
      "plop": "plop"
  },
  ```

* 启动 plop，生成组件

  ```powershell
  yarn plop
  ```

  执行命令过程中，输入名称，如图所示：

  ![image-20210202172350407](F:\LaGou\03-module\04-min-module\assets\image-20210202172350407.png)

  生成的组件目录结构，如图所示：

  ![image-20210202172443196](F:\LaGou\03-module\04-min-module\assets\image-20210202172443196.png)