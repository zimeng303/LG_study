// 类型声明文件
// d.ts 文件的核心作用：“骗” TS
// 告诉 ts 以 .vue 结尾的文件是什么样的类型
declare module '*.vue' {
  // import 写在内部的原因
  import Vue from 'vue'
  export default Vue
}

// type 类似 interface ，临时使用可以，通常使用 interface
type Foo = {
  name: String
}

// ts 文件中一旦出现 import / export，TS 就会认为这是一个模块文件，就有一个独立的模块作用域
// export {}