// d.ts 文件的核心作用："骗" TS

declare module '*.vue' {
  // import 写在内部的原因：
  import Vue from 'vue'
  export default Vue
}

type Foo = {
  name: string
}

// ts 文件中一旦出现 import / export，TS 就会认为这是一个模块文件，就有一个独立的模块作用域
// export {}
