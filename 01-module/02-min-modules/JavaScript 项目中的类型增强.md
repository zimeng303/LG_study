@[TOC](JavaScript 项目中的类型增强)

## 三、相关扩展：JavaScript 项目中的类型增强

JavaScript 项目中如何有更好的类型提示：JSDoc + [import-types](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#import-types)

https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html

https://www.typescriptlang.org/play/index.html?useJavaScript=truee=4#example/jsdoc-support

### 文档型注释

* `@param`

  ```js
  /**
   * @param { HTMLElement } el
   */
  function appendTable (el) {
      // el.appendChild
  }
  
  // 类似于 TypeScript 语法
  function appendTable (el: HTMLElement) {
      // el.appendChild
  }
  ```

### 类型注解

* `@type`

  ```js
  /** @type { string } */
  let foo = '123'
  ```

* `@typedef`

  类型定义

  ```js
  /** @typedef {'open' | 'close'} Status */
  
  /** @type { Status } */
  let bar = 'close'
  ```

1. 配置文件类型
2. router 类型
3. store 类型

### 类型检查

`@ts-check`

vscode 提供的，编写过程中进行类型检查

```js
// @ts-check
```

### 类型补充声明

插件的类型扩展，使用类型补充声明

```javascript
import { AxiosInstance } from 'axios'

declare module 'vue/types/vue' {
    interface Vue {
        readonly $api: AxiosInstance
    }
}
```

