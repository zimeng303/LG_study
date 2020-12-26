# 20201117 直播


## 一、使用 TypeScript 的 Vue.js 项目差异

1）基本操作

1. 安装 @vue/cli 最新版本
2. 使用 @vue/cli 创建一个项目（不选 TypeScript)
3. 使用 @vue/cli 安装 TypeScript 插件

2）通过 Git Diff 对比介绍使用 TypeScript 的 Vue.js 项目差异

1. 安装了 @vue/cli-plugin-typescript 等插件
2. shims-vue.d.ts 文件的作用
3. shims-tsx.d.ts 文件的作用

## 二、定义组件的几种不同方式

### 写法 1：使用 Options APIs

- 组件仍然可以使用以前的方式定义（导出组件选项对象，或者使用 Vue.extend()）
- 但是当我们导出的是一个普通的对象，此时 TypeScript 无法推断出对应的类型，
- 至于 VSCode 可以推断出类型成员的原因是因为我们使用了 Vue 插件，
- 这个插件明确知道我们这里导出的是一个 Vue 对象。
- 所以我们必须使用 `Vue.extend()` 方法确保 TypeScript 能够有正常的类型推断

```typescript
import Vue from 'vue'

export default Vue.extend({
  name: 'Button',
  data () {
    return {
      count: 1
    }
  },
  methods: {
    increment () {
      this.count++
    }
  }
})
```

### 写法 2：使用 Class APIs

在 TypeScript 下，Vue 的组件可以使用一个继承自 Vue 类型的子类表示，这种类型需要使用 Component 装饰器去修饰

装饰器函数接收的参数就是以前的组件选项对象（data、props、methods 之类）

```typescript
import Vue from 'vue'
import Component from 'vue-class-component' // 官方库

@Component({
  props: {
    size: String
  }
})
export default class Button extends Vue {
  private count: number = 1
  private text: string = 'Click me'

  get content () {
    return `${this.text} ${this.count}`
  }

  increment () { // 事件处理函数
    this.count++
  }

  mounted () { // 生命周期函数
    console.log('button is mounted')
  }
}
```

- Data: 使用类的实例属性声明
- Method: 使用类的实例方法声明
- Computed: 使用 Getter 属性声明
- 生命周期: 使用类的实例方法声明

**其它特性：例如 components, props, filters, directives 之类的，则需要使用修饰器参数传入！！！！！**

使用这种 class 风格的组件声明方式并没有什么特别的好处，只是为了提供给开发者多种编码风格的选择性

#### 装饰器

> [装饰器](https://github.com/tc39/proposal-decorators)是 ES 草案中的一个新特性，提供一种更好的面向切面编程（AOP）的体验，不过这个草案最近有可能发生重大调整，所以个人并不推荐。

TypeScript 中对装饰器的实现：https://www.staging-typescript.org/docs/handbook/decorators.html

- 类装饰器

  ```typescript
  function classDecorator (constructor: Function) {
    console.log('源类型：', constructor)
  }
  ```

- 方法装饰器

  ```typescript
  function methodDecorator (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log('目标对象：', target)
    console.log('属性名称：', propertyKey)
    console.log('属性描述符：', descriptor)
    // descriptor 指的就是 Object.definedProperty 传入的第三个参数
  }
  ```

- 访问器（getter/setter）装饰器

  ```typescript
  function accessorDecorator (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log('目标对象：', target)
    console.log('属性名称：', propertyKey)
    console.log('属性描述符：', descriptor)
  }
  ```

- 属性装饰器

- 参数装饰器


### 写法 3：使用 Class APIs + [vue-property-decorator](https://github.com/kaorun343/vue-property-decorator)

```typescript
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class Button extends Vue {
  private count: number = 1
  private text: string = 'Click me'
  @Prop() readonly size?: string

  get content () {
    return `${this.text} ${this.count}`
  }

  increment () {
    this.count++
  }

  mounted () {
    console.log('button is mounted')
  }
}
```

这种方式继续放大了 class 这种组件定义方法。

### 个人最佳实践

No Class APIs，只用 Options APIs。

使用 Options APIs 最好是使用 `export default Vue.extend({ ... })` 而不是 `export default { ... }`。

其实 Vue.js 3.0 早期是想要放弃 Class APIs 的，不过无奈想要兼容，所以才保留下来了。

## 三、相关扩展：JavaScript 项目中的类型增强

JavaScript 项目中如何有更好的类型提示：JSDoc + [import-types](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#import-types)

https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html

https://www.typescriptlang.org/play/index.html?useJavaScript=truee=4#example/jsdoc-support

### 类型注解

- `@type`
- `@typedef`

1. 配置文件类型
2. router 类型
3. store 类型

### 类型检查

`@ts-check`

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



## 四、ES2018+

- ES2018
  - 展开和剩余在对象上的应用
  - 正则表达式的增强
  - Promise.prototype.finally(() => {}) // then catch
- ES2019
  - 数组稳定排序
  - try...catch 参数可省略
- ES2020
  - 空值合并运算符
  - 可选链运算符
  - Promise.allSettled()，Promise.all 其中一个任务失败就会导致全部结束
  - BigInt
  - 动态导入


