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
    * `--sourcemap`：开启代码地图
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

    ![image-20201214151455912](C:\Users\li_sh\AppData\Roaming\Typora\typora-user-images\image-20201214151455912.png)

**调试**

* examples 的示例中引入的 vue.min.js 改为 vue.js
* 打开 Chrome 的调试工具中的 source











