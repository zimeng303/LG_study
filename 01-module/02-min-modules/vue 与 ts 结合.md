## 一、使用 TypeScript 的 Vue.js 项目差异

1）基本操作

1. 安装 @vue/cli 最新版本

2. 使用 @vue/cli 创建一个项目（不选 TypeScript)

   ```powershell
   $ vue create vue-ts-demo
   ```

3. 使用 @vue/cli 安装 TypeScript 插件

   ```powershell
   $ vue add typescript
   ```

2）通过 Git Diff 对比介绍使用 TypeScript 的 Vue.js 项目差异

1. 安装了 @vue/cli-plugin-typescript 等插件

   <font color="#999999">package.json，对比差异，如下图所示：</font>

   ![image-20201226100255887](C:\Users\li_sh\Desktop\WebStudy\LaGou\01-module\02-min-modules\imgs\image-20201226100255887.png)

2. shims-vue.d.ts 文件的作用

   ```ts
   // 类型声明文件
   // d.ts 文件的核心作用：“骗” TS
   // 告诉 ts 以 .vue 结尾的文件是什么样的类型
   declare module '*.vue' {
       // import 写在内部的原因
       import Vue from 'vue'
       export default Vue
   }
   ```

3. shims-tsx.d.ts 文件的作用

   ```ts
   import Vue, { VNode } from 'vue'
   
   // 只有当我们使用 JSX 语法才需要
   // 默认 TS 遇到 JSX 节点的类型都是 React
   // 这里是对默认的全局 global 命名空间做补充说明
   declare global {
       namespace JSX {
           // tslint:disable no-empty-interface
           interface Element extends VNode {}
           // tslint:disable no-empty-interface
           interface ElementClass extends Vue {}
           interface IntrinsicElements {
               [elem: string]: any
           }
       }
   }
   ```

3）注意

1. 没有类型声明的文件，在 ts 中是无法引用的，除非是 ts 文件
2. ts 文件中一旦出现 import / export，TS 就会认为这是一个模块文件，就有一个独立的模块作用域