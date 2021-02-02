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

  ![image-20210127172944425](C:\Users\86135\AppData\Roaming\Typora\typora-user-images\image-20210127172944425.png)

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

![image-20210128163017063](C:\Users\86135\AppData\Roaming\Typora\typora-user-images\image-20210128163017063.png)

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

  





* 基于模板生成包的结构

  

* 组件测试

* Rollup

