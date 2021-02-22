**源码采用 `TypeScript` 重写**

> 为了提升代码的可维护性，源码都使用 `TypeScript` 编写，大型项目项目的开发都推荐使用类型化的语言。

**使用 `Monorepo` 管理项目结构**

> 使用一个项目管理多个包，把不同的功能放到不同的 `package` 中进行管理，这样每个功能模块都划分的比较明确，模块之间的依赖关系也很明确，并且每个模块都能单独发布、测试及使用。

* `packages` 目录结构

  ![image-20210204154158100](F:\LaGou\03-module\05-min-module\assets\image-1.png)

  > * `compiler-core`：和平台无关的编译器 
  > * `compiler-dom`：浏览器平台下的编译器，依赖于 `compiler-core`
  > * `compiler-sfc`：单文件组件编译器，依赖于 `compiler-core` 和 `compiler-dom`
  > * `compiler-ssr`：服务端渲染的编译器，依赖于 `compiler-dom` 
  > * `reactivity`：数据响应式系统，可以独立使用
  > * `runtime-core`：和平台无关的运行时
  > * `runtime-dom`：针对浏览器的运行时，处理原生 DOM API 和 事件等
  > * `runtime-test`：为测试所编写的轻量级运行时，由于它渲染出来的 DOM 树其实是一个 **js 对象**，所以 这个运行时可以运行在所有的 js 环境里，可以用它来测试渲染是否正确，还可以用于序列化 DOM，触发 DOM 事件，以及记录更新中的某次 DOM 操作
  > * `server-renderer`：用于服务端渲染
  > * `shared`：vue 内部使用的公共 api
  > * `size-check`：私有的包，不会发布到 npm，作用是在 tree-sharking 后检查包的大小
  > * `template-explorer`：浏览器里运行的实时编译组件，它会输出 render 函数
  > * `vue`  用来构建完整版的 vue，依赖于 `compiler` 和 `runtime`

**Vue.js 3.0 不同构建版本**

> 不再构建 umd 模块化方式，umd 模块化方式会让代码有更多的冗余，要支持多种模块化的方式，把 cjs、esm、（IIF）自执行分别打包到了不同的文件中。

* `packages/vue`，包含了所有的构建版本

  ![image-20210204154454895](F:\LaGou\03-module\05-min-module\assets\image-2.png)

* cjs (CommonJs -- 完整版的vue，包含编译器和运行时)

  * vue.cjs.js：开发版，未被压缩的代码
  * vue.cjs.prod.js：生产版，压缩的代码

* global（全局，可以直接通过 script 标签来导入，导入 js 后会增加一个全局的 vue 对象）

  * vue.global.js：完整版的vue，包含编译器和运行时
  * vue.global.prod.js
  * vue.runtime.global.js：只包含运行时的构建版本
  * vue.runtime.global.prod.js

* browser（浏览器的原生模块化的方式，在浏览器中可以直接使用 `type="module"` 的方式直接导入这些模块。）

  * vue.esm-browser.js：完整版的 Vue，包括运行时和编译器
  * vue.esm-browser.prod.js
  * vue.runtime.esm-browser.js：只包含运行时的构建版本
  * vue.runtime.esm-browser.prod.js

* bundler（没有打包所有代码，配合打包工具来使用，都是用 `ESModule` 模块化方式，内部通过 `import` 导入了 `runtime-core`，构建体积最小)

  * vue.esm-bundler.js：完整版的Vue，内部导入了 `runtime-compiler`
  * vue.runtime.esm-bundler.js：使用脚手架创建的项目默认导入的是 vue.runtime.esm-bundler，只导入了运行时，是vue的最小版本，在项目开发完毕后只会打包使用到的代码，可以让 vue 的体积更小。