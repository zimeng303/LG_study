# @[TOC](TypeScript)

# 前言

解决 JavaScript 类型系统的问题，大大提高代码的可靠程度

JavaScript 自有类型系统的问题

### 强类型 与 弱类型（类型安全）

* 强类型：语言层面限制函数的实参类型 必须与形参类型相同

  ​               不允许任意的隐式数据类型转换

* 弱类型：语言层面不会限制实参的类型

  ​               允许任意的隐式数据类型转换

强类型有更强的类型约束，而弱类型中几乎没有什么约束

### 静态类型 与 动态类型（类型检查）

* 静态类型：一个变量声明时，它的类型就是明确的

  ​                  变量声明过后，它的类型就不允许再修改

* 动态类型：运行阶段才能够明确变量类型，

  ​                  而且变量的类型随时可以改变

  ​                  动态类型语言中的变量没有类型

  ​                  变量中存放的值是有类型的      

### JavaScript 类型系统 特征

弱类型 && 动态类型    

没有编译环节 -- 脚本语言

* 弱类型的问题

  

* 强类型的优势

  ​     1、错误更早暴露

  ​     2、代码更智能，编码更准确

  ​     3、重构更牢靠

  ​     4、减少不必要的类型判断

### Flow 静态类型检查方案  -- JavaScript的类型检查器

Babel，只是一个小工具

#### 类型注解  (Type Annotations) 

1. 如何安装并使用 flow 命令

* yarn init -y       初始化包管理文件 package.json

* yarn add flow-bin --dev   安装 flow 检查依赖包

* yarn flow init 初始化配置文件 .flowconfig

* 使用flow：在代码中添加 **// @flow** 或者 **/* @flow */** ，进行参与flow检查的注解

* yarn flow    启动 检查 服务

* yarn flow stop 关闭检查服务

* 注意

  安装目录中不要出现中文<img src="C:\Users\li_sh\Desktop\微信图片_20201106143459.png" alt="报错信息" style="zoom:80%;" />

2. 编译：通过编译移除 [类型注解]

   1）使用 flow-remove-types （flow官方提供）

   * yarn add flow-remove-types --dev 安装命令

   * yarn flow-remove-types 源代码所在目录  -d 转换过后的输出目录

      -- 通过 -d 指定转换过后的输出目录

   2）Babel

   * yarn add @babel/core @babel/cli @babel/preset-flow --dev 安装babel命令

     -- @babel/core ：Babel 的核心模块

     -- @babel/cli：Babel的cli工具，可以使我们在命令行工具中直接使用                            Babel 命令完成编译

     -- @babel/preset-flow：包含了转换类型注解的插件

   * 在根目录中添加 babel 的配置文件 .babelrc，并使用 presets 字段设定转码规则

     ```
     {
         "presets": ["@babel/preset-flow"]
     }
     ```

   * yarn babel 源代码所在目录  -d 转换过后的输出目录

   3. 开发工具插件：Flow Language Support -- 反应较迟钝

      网址：https://flow.org/en/docs/editors -- 展示所有编辑器支持情况

#### 类型推断(Type Inference)

#### 原始类型(Primitive Types)

* 注意

  ​       值为 undefined 时，数据类型标记为 void

#### 数组类型

#### 对象类型

#### 函数类型

#### 特殊类型

#### Mixed & Any（任意类型）

官网：https://flow.org/en/docs/types 对所有类型的描述文档

https://www.saltycrane.com/cheat-sheets/flow-type/latest/ 推荐查询文档

#### 运行环境 API  -- 内置对象



### TypeScript 语言规范与基本应用

### TypeScript 概述

JavaScript 的超集 （superset）

<img src="C:\Users\li_sh\Desktop\1604720008(1).jpg" alt="TypeScript 范围展示" style="zoom:67%;" />



特点：自动转换新特性，最低可以编译到ES3版本

任何一种 JavaScript 运行环境都支持

相比于flow，功能更为强大，生态也更健全、更完善

Angular / Vue 3.0

TypeScript ---- 前端领域中的第二语言，属于 **渐进式**

缺点：

​		1、语言增加了很多概念

​		2、项目初期，TypeScript 会增加一些成本



#### 快速上手 

* yarn init --yes

* 安装TypeScript模块：yarn add typescript --dev   

  -- 这个模块提供 tsc 的命令，用来编译

* 新建 .ts 结尾的 TypeScript 文件
* 将 .ts文件 编译为 .js文件：yarn tsc 文件路径
* 编译过程中，先检查类型使用异常，然后移除一些类型注解等扩展语法，并且会自动转换 ECMAScript 的新特性

#### 配置文件

* 初始化 tsconfig.json 配置文件：yarn tsc --init

* 配置文件中的编译源代码（rootDir）一般在 src 文件夹中存放
* 配置文件中的输出文件（outDir）一般放置在 dist 文件夹中
* 编译，yarn tsc ：根据配置文件，会编译 src 中全部的 .ts 文件

#### 原始类型

```javascript
/**
 * 原始数据类型
 */

const a: string = 'foobar'

const b: number = 100 // NaN // Infinity

const c: boolean = true // false

// const d: string = null // 严格模式下，语法错误
// const d: boolean = null // 严格模式下，语法错误

const e: void = undefined

const f: null = null

const g: undefined = undefined

/**
* 如果配置文件中的 "target" 设为 es5 一下版本，下面代码将会报错
*/ 
const h: symbol = Symbol() 
/** -- 解决方案
* 一、将 tsconfig.json 文件中的 "target"，设为 "es2015" 以上版本
* 二、tsconfig.json 文件中的 "target" 还是为 "es5"等原来的版本，
*     但要添加标准库(标准库就是内置对象所对应的声明)，即在 tsconfig.json 文件中的 *     "lib" 数组中添加 "ES2015"，但是若只添加这一选项，则会覆盖原来的标准库，因此，*     需要把原来的标准库添加回来，如"DOM"(在标准库中，"DOM"标准库包含了 dom 和 *  *     bom)
*/                         
```

#### 标准库声明

#### 显示中文错误消息

* 命令行打印中文错误信息：yarn tsc --locale zh-CN
* 配置 VScode 显示中文错误信息：首选项 -- 设置 -- 搜索 -- typescript locale -- 改为 zh-CN（不推荐）

#### 作用域问题

```c
// 作用域问题

// 编译时，会报错，
// 因为在其他文件中已经在 全局作用域 中定义

/** -- 解决方案
 * 一、使用 匿名函数，立即执行，生成单独的作用域
 * 二、使用 export {}，利用导出模块的概念，生成作用域
 */

// (function () {
//     const a = 123
// })()

const a = 123

// 下面的 {} 并不是指导出空对象，而是 export 的语法

// 利用下面的语法，可以使这个文件中的成员变成这个模块当中的局部成员
// 一般不会用，实际开发中，就会以模块的形式进行开发
export {}
```

#### Object 类型

不是特指 对象类型，而是泛指所有的非原始的数据类型，即包括 对象、数组、函数 ...

```c
const foo: object = function () {} // [] // {}

// 类似对象字面量：属性类型数量要一一对应
const obj: { foo: number, bar: string } =  { foo: 123, bar: 'string' }

```

#### 数组类型

```c
/** -- 声明数组的两种形式
* 一、使用 Array泛型
* 二、使用 数据类型 + [] 形式，这种比较常用
*/

const arr1: Array<number> = [1, 2, 3] // 使用 Array泛型

const arr2: number[] = [1, 2, 3]      // 类型[]比较常用

// 数据类型 + [], 常用的举例

function sum (...args: number[]) {
    return args.reduce((prev, current) => prev + current, 0)
}

// sum(1, 2, 3, 'foo') // 报错
```

#### 元组类型（Tuple Types）

元组就是一个明确元素数量以及元素类型的数组。

各个元素的类型不必要完全相同。

一般用于在一个函数中去返回多个返回值

```c
/** -- 定义元组
 * 使用类似 数组字面量 的形式
 * 如果元素对应类型不相符，或者元素数量不一致，都会报错
 */ 

const tuple: [number, string] = [18, 'foo']

// 访问：
// 一、使用数组下标的形式
// const age = tuple[0]
// const name = tuple[1]

// 二、使用数组解构的方式，提取数组中的每个元素
const [age, name] = tuple

// 返回元组的例子
Object.entries({
    foo: 123,
    bar: 456
})
```

#### 枚举类型

* 特点

  1、给一组数值去分别取上一个更好理解的名字

  2、一个枚举中只会存在几个固定的值，并不会出现超出范围的可能性

* 语法 和 注意

  ```c
  // js语法：使用对象模拟实现枚举
  /*
      const PostStatus = {
          Draft: 0,
          Unpublished: 1,
          Published: 2
      }
  */
  
  
  // TypeScript语法：使用 enum 关键字, 注意使用的是 "="
  /*
      const PostStatus = {
          Draft = 0,
          Unpublished = 1,
          Published = 2
      }	
  */
  
  // 可以不指定具体的值，默认从 0 开始累加
  /*
      enum PostStatus {
          Draft,
          Unpublished,
          Published
      }	
  */
  
  // 也可以给第一个指定具体的值，后面的值将会在第一个指定值的基础上，执行累加
  /*
      enum PostStatus {
          Draft = 3,
          Unpublished,
          Published
      }	
  */
  
  // 给定的值，既可以是数值型，也可以是字符串，即字符串枚举
  // 由于字符串无法累加，因此需要自行赋值。字符串枚举并不常见
  /*
      enum PostStatus {
          Draft = 'aaa',
          Unpublished = 'bbb',
          Published = 'ccc'
      }	
  */
  
  // 枚举类型 会影响编译的结果，最终会编译为双向的键值对对象
  // 目的：可以让我们动态的通过枚举值(0, 1, 2, ...)去获取枚举的名称
  // PostStatus[0] // =>Draft 通过索引器的形式访问对应的枚举名称
  // 如果确定不会使用索引器的形式访问枚举，那么建议使用常量枚举
  const enum PostStatus {
      Draft,
      Unpublished,
      Published
  }
  
  const post = {
      title: 'Hello TypeScript',
      content: 'TypeScript is a typed superset of JavaScript.',
      status: PostStatus.Draft // 2 // 1 // 0
  }
  
  ```

#### 函数类型

对函数的输入输出进行类型限制，输入：参数；输出：返回值

```c
/** -- 定义函数 方式一：函数声明
 * 如果某个参数可传可不传：
 *    1、可在形参的参数名后面添加 "?" , 使其变成可选的；
 *    2、使用 es6中添加参数默认值的方法, 使其变成可有可无的。
 * 
 * 若需要接收任意个数的参数，使用 es6 中的rest操作符
 * 
 * 注意：
 *    1、形参列表都为必传参数时，传入的实参类型和数量，都必须与形参保持一致
 *    2、可选参数，必须放在参数列表的最后面
 */

function func1 (a: number, b?: number, c: number = 10, ...rest: number[]): string {
    return 'func1'
}

func1(100, 200)

// *********************************************

/** -- 定义函数 方式二：函数表达式
 * 这种对于回调函数的形参类型，需要进行约束
 */

const fun2: (a: number, b: number) => string = function (a: number, b: number): string {
    return 'func2'
}
```

#### 任意类型

any 就是用来接收任意类型数据的一种类型，动态类型

不会有任何的类型检查，很可能会存在类型安全的问题，轻易不要使用

```c
function stringify (value: any) {
    return JSON.stringify(value)
}

stringify('string')

stringify(100)

stringify(true)

let foo: any = 'string'

// 在使用过程中，可以接收任意类型的数据
foo = 100

foo.bar() // 语法上不会报错
```

#### 隐式类型推断

#### 类型断言

类型转换是代码运行时的概念

类型断言是在编译过程中的概念，代码编译过后，将不会存在

```c
// 假设这个 nums 来自一个明确的接口
const nums = [110, 120, 119, 112]

const res = nums.find(i => i > 0)

// TypeScript 推断出 res: number | undefined，不能执行下面类似操作
// const square = res * res 

/** -- 断言的两种方式
 * 一、使用 as 关键字，明确告诉 TypeScript 这个数据的具体类型
 * 二、使用 <数据类型> 的方式，但 JSX下会有语法冲突，不能使用
 */
const num1 = res as number

const num2 = <number>res 
```

#### 接口（Interfaces）

* 作用

  接口就是用来约束对象的结构。

  一个对象要是去实现一个接口，那么这个对象必须拥有接口中的所有成员

* 语法

  ```c
  interface  接口名称 {
      属性名1: 数据类型;
      属性名2: 数据类型
      ...
      属性名n: 数据类型
  }
  ```

  ```c
  // 约定一个对象当中，具体应该有哪些成员，以及成员的类型又是什么样的
  interface Post {
      title: string; // 内部成员可用 ";" 分割，也可以不加 
      content: string
      subtitle?: string   // ? 可选成员
      readonly summary: string // 只读成员
  }
  
  function pointPost (post: Post) {
      console.log(post.title);
      console.log(post.content);   
  }
  
  const post: Post = {
      title: 'Hello TypeScript',
      content: 'A javascript superset',
      summary: 'A javascript'
  }
  // post.summary = 'other' // 不可修改
  pointPost(post)
      
  // 添加动态成员
  interface Cache {
      [key: string]: string // key 代表属性名，可随意取名
  }
  
  const cache: Cache = {}
  
  cache.foo = 'value1'
  cache.bar = 'value2'
  ```

  * 总结

    TypeScript 中的接口只是用来为有结构的数据，做类型约束。在实际运行中，，没有实际意义。

    

#### 类（class）

* 概述

  描述一类具体事物的抽象特征，主要用来描述一类具体对象的抽象成员。

* 声明属性

  在TypeScript中要明确在类型当中，声明它所拥有的一些属性，而不是在构造函数当中动态通过this去添加。

```c
/**
 * ES2016新增，在类型当中声明属性的方式，就是直接在类中定义
 *
 * 注意：
 *     在TypeScript中，类的属性必须有一个初始值
 * 
 * 属性赋初始值的方式：
 *    1、在 "=" 后面赋值
 *    2、在构造函数中进行初始化，动态的为属性赋值
 */
class Person {
    name: string // = 'init name' 
    age: number 

    constructor (name: string, age: number) {
        this.name = name
        this.age = age
    }

    sayHi (msg: string): void {
        console.log(`I am ${this.name}, ${msg}`)        
    }
}
```

* 类的访问修饰符

  主要用来控制类当中成员的可访问级别。

  1、private ：私有成员，只能在类的内部进行使用，外部访问不到，不允许继承

  2、public ： 公有成员，默认就是 public，建议手动添加上，便于理解

  3、protected : 受保护的，外部访问不到，只允许在子类当中访问对应的成员，允许继承

  ```c
  class Person {
      public name: string // 公有属性
      private age: number  // 私有属性
      protected gender: boolean // 受保护的，只能在子类中被访问
  
      constructor (name: string, age: number) {
          this.name = name
          this.age = age
          this.gender = true
      }
  
      sayHi (msg: string): void {
          console.log(`I am ${this.name}, ${msg}`)        
          console.log(this.age)        
      }
  }
  const tom = new Person('tom', 18)
  console.log(tom.name)
  // console.log(tom.age) // 报错
  // console.log(tom.gender) // 报错
  
  class Student extends Person {
      /** -- 构造函数被私有化
       * 1、构造函数被私有化，将不能在外部使用 new 关键字进行实例化
       * 2、需要在类中定义静态方法，并返回 创建的类的实例
       */
      private constructor (name: string, age: number) {
          super(name, age)
          console.log(this.gender);
      }
  
      static create (name: string, age: number) {
          return new Student(name, age)
      }
  }
  const jack = Student.create('jack', 20)
  ```

* 类的只读属性

  ```c
  class Person {
      protected readonly gender: boolean // readonly 要放在访问修饰符的后面
      constructor () {
          this.gender = true             // 注意：初始化过后，不可以再修改
      }
  }
  ```

* 类 与 接口

  ```c
  // 一个接口只去约束一个能力，让一个类型同时去实现多个接口
  interface Eat {
      eat (food: string): void
  }
  interface Run {
      run (distance: number): void
  }
  
  // 不同的类型，实现相同的接口
  class Person implements Eat, Run {
      eat (food: string): void {
          console.log(`优雅的进餐：${food}`)        
      }
  
      run (distance: number) {
          console.log(`直立行走：${distance}`)
      }
  }
  
  class Animal implements Eat, Run {
      eat (food: string): void {
          console.log(`呼噜呼噜的吃：${food}`);        
      }
  
      run (distance: number) {
          console.log(`爬行：${distance}`)        
      }
  }
  ```

* 抽象类

  类似于接口，用来约束子类当中必须要有某一个成员。但与接口不同的是，抽象类可以包含一些具体的实现，而接口只能是某一个成员的抽象，不包括具有的实现。

  ```c
  // 抽象类只能被继承，不能再使用 new 进行实例化
  abstract class Animal {
      eat (food: string): void {
          console.log(`呼噜呼噜的吃：${food}`)        
      }
  
      // 抽象方法, 不需要方法体
      abstract run (distance: number): void 
  }
  
  // 当父类中存在抽象方法时，子类必须去实现抽象方法
  class Dog extends Animal {
      run(distance: number): void {
          console.log('四脚爬行', distance);
      }
  
  }
  
  // 子类创建实例时，会同时拥有父类中的方法，以及自身所实现的方法
  const d = new Dog()
  d.eat('嗯')
  d.run(1)
  ```

#### 泛型

* 概述

  泛型就是在声明函数时不去指定具体的类型，等到在调用的时候再去传递具体的类型。

* 目的：

  极大程度的去复用代码。

  ```c
  function createNumberArray (length: number, value: number): number[] {
      // Array 默认创建的是 any类型的数组，因此需要使用泛型进行指定，传递一个类型
      return Array<number>(length).fill(value)
  }
  
  function createStringArray (length: number, value: string): string[] {
      return Array<string>(length).fill(value)
  }
  
  // 不明确的类型，使用 T 替换，调用时传入
  function createArray<T> (length: number, value: T): T[] {
      return Array<T>(length).fill(value)
  }
  
  // const res = createNumberArray(3, 100) // res => [100, 100, 100]
  
  const res = createArray<string>(3, 'foo')
  ```

  

* 总结

  泛型就是定义时不能明确的类型变成一个参数，让我们在使用的时候再去传递的类型参数。

#### 类型声明

* 作用：

  兼容普通的js代码

  下面以 lodash 为例，手动声明函数类型

  ```c
  // 此时，只是安装了 'lodash' 开发依赖
  import { camelCase } from 'lodash'
  
  // 需要使用 declare 关键字，手动声明函数类型
  declare function camelCase(input: string): string
  
  const res = camelCase('hello typed') // 不手动声明，会报错
      
  ```

  安装类型声明模块： yarn add @types/lodash --dev

  ```c
  import { camelCase } from 'lodash'
  
  const res = camelCase('hello typed')
  ```

  * 类型声明模块介绍

    类型声明模块没有实际的代码，只是对对应的模块做一些类型声明。若模块中已经存在类型声明，则不需要引入类型声明模块。

    形式：@types/模块名

# Polyfill

TS 对于语言的编译，只是语法层面，如果是 API 层面的的补充，需要手动 Polyfill!

## core-js

core-js 基本上把能 polyfill API 都实现了。但是，属于手动引入 Polyfill。

* 1，安装插件模块

  ```power
  $ npm i core-js --save
  ```

* 2，使用core-js，两种引入方式，建议按需引入

  <font color="#999999">引入语法如下：</font>

  ```javascript
  // 一, 全部引入
  import 'core-js'
  
  // 二, 按需引入
  import 'core-js/features/object'
  ```

* 3，测试是否成功

  ```powershell
  $ nvm use 12  # 12 node version, compile ts
  $ tsc         # compile ts
  $ nvm use 0   # 0 node version
  $ node xxx.ts # success or failure
  ```

* **无法实现 Polyfill**

  > Object.defineProperty 完全无法 Polyfill
  >
  > Promise 微任务，用宏任务代替

## Babel

使用 Babel 自动化的 Polyfill。

* 1，安装依赖模块

  ```powershell
  $ npm i @babel/cli @babel/core @babel/preset-env @babel/preset-typescript --save
  ```

  **模块注释**

  > @babel/cli：babel 的命令行入口
  >
  > @babel/core：babel的核心模块
  >
  > @babel/preset-env：是一个包含ES新特性所有转换插件的集合，可以根据环境判断哪些转哪些不转
  >
  > @babel/preset-typescript：是一个包含typescript转换为ES的插件集合

* 2，配置babel.config.js文件

  <font color="#999999">配置代码如下：</font>

  ```javascript
  // JSDoc
  
  // @ts-check
  
  /** @type {import('@babel/core').ConfigAPI} */
  module.exports = {
    presets: [
      [
        '@babel/env',
        {
          useBuiltIns: 'usage',
          corejs: {
            version: 3
          }
        }
      ],
      '@babel/typescript' // 不会做 TS 语法检查，只是移除类型注解
    ]
  }
  ```

* 3，使用编译命令

  ```powershell
  $ npx babel source.ts -o output.js # source.ts 源文件  output.js 编译后的文件
  ```

  

