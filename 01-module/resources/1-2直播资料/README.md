# 20201109 直播

## 零、答疑

1. “对原型添加方法更好”，有疑惑，我在方法里面做一些访问属性的操作后，发现原型添加方法更消耗性能

   https://jsbench.me/

    ```javascript
   function Person (id) {
     this.id = id
   }

   Person.prototype.say = function () {
     console.log(this.id, 'say~')
   }

   var p = new Person(Date.now())
   p.say()

   // ===== vs =====

   function Person (id) {
     this.id = id
     this.say = function () {
       console.log(this.id, 'say~')
     }
   }

   var p = new Person(Date.now())
   p.say()
    ```

    ```javascript
   function Person (id) {
     this.id = id
   }

   Person.prototype.say = function () {
     console.log(this.id, 'say~')
   }

   for (var i = 0; i < 1000; i++) {
     var p = new Person(Date.now())
     p.say()
   }

   // ===== vs =====

   function Person (id) {
     this.id = id
     this.say = function () {
       console.log(this.id, 'say~')
     }
   }

   for (var i = 0; i < 1000; i++) {
     var p = new Person(Date.now())
     p.say()
   }
    ```

2. 手写 Promise 源码中微任务实现的问题。

   由于老环境下微任务无法模拟，所以这不可能

3. TypeScript 在实战中的一些代码片段，比如联合类型，可选值什么的，现在讲的太浅显了

4. ts可以通过配置文件把代码编译至ES5，针对ES6新的API是否还得结合babel进行polyfill？

   TS 对于语言的编译，只是语法层面，如果是 API 层面的的补充，需要手动 Polyfill!

   1. 不使用第三方工具的情况下，需要手动引入 Polyfill
   2. 使用 Babel 自动化的 Polyfill

5. 希望讲解Typescript是如何处理第三方库的，如何把我们自己的代码发布成npm包

   https://github.com/zce/caz

6. V8内部的工作原理

   ![image-20201109192804679](/Users/zce/Desktop/media/image-20201109192804679.png)

7. 想了解更多的Symbol类型的使用案例。
   - 私有属性，序列化、遍历都拿不到
   - Vuex / Redux 中的 Mutation / ActionType

8. GC回收的新生代区回收机制，我看部分资料说从From到To的复制过程其实已经是整理过程了，然后并没有提到使用标记整理算法，想确认一下。 

9. 引用计数算法不会产生内存碎片吗？我看视频中没有提到这个。 

   引用计数算法没有明确空间回收后的整理操作，它是将单个垃圾空间整体回收，所以是没有碎片的。

10. 模块化的疑难杂症,如webpack是如何将import,require进行转化的,require.default的本质原因,以及未来的模块化趋势 

11. 除js外,讲点css类的基本功,如现在的移动端开发的自适应,响应式问题,em,rem,vh等的适应场景和建议,如何设计最优雅的,如动效类 

12. 常用的界面样式库,组件库等,如何快速开发原型 

    1. Bootstrap / Tailwindcss



---

- 直接用 core-js：https://github.com/zloirock/core-js
- 配合 babel 使用：https://babeljs.io/docs/en/babel-preset-typescript

Polyfill 垫片/补充

```javascript
if (!window.XMLHttpRequest) {
  window.XMLHttpRequest = function () { .... }
}

if (!Object.entries) {
  Object.entries = ...
}
```



## 一、关于 this 的回顾

```javascript
function foo () {
  console.log(this)
}

foo() // => 全局对象 / globalThis
foo.call(1) // => 1
```

```javascript
const obj1 = {
  foo: function () {
    console.log(this)
  }
}

obj1.foo() // => obj1
const fn = obj1.foo
fn() // => window
```


```javascript
const obj2 = {
  foo: function () {
    function bar () {
      console.log(this)
    }
    bar()
  }
}

obj2.foo()
```

关于 this 的总结：

1. 沿着作用域向上找最近的一个 function（不是箭头函数），看这个 function 最终是怎样执行的；
2. this 的指向取决于所属 function 的调用方式，而不是定义；
3. function 调用一般分为以下几种情况：
   1. 作为函数调用，即：`foo()`
      1. 指向全局对象（globalThis），注意严格模式问题，严格模式下是 undefined
   2. 作为方法调用，即：`foo.bar()` / `foo.bar.baz()` / `foo['bar']` / `foo[0]()`
      1. 指向最终调用这个方法的对象
   3. 作为构造函数调用，即：`new Foo()`
      1. 指向一个新对象 `Foo {}`
   4. 特殊调用，即：`foo.call()` / `foo.apply()` / `foo.bind()`
      1. 参数指定成员

4. 找不到所属的 function，就是全局对象

谢天谢地，以后再无 this 问题。。。

then:

```javascript
var length = 10
function fn () {
  console.log(this.length)
}

const obj = {
  length: 5,
  method (fn) {
    // arguments[0] === fn // => true
    fn()
    arguments[0]()
  }
}

obj.method(fn, 1, 2)
```

谢天谢地，以后真的再无 `this` 问题。。。

### Node.js 环境

- 由于文件代码中最顶层的作用域实际上是一个伪全局环境，所以最顶层的 `this` 并不指向全局对象

### 严格模式

严格模式下原本应该指向全局的 `this` 都会指向 `undefined`

---

- this
- prototype
- 声明提升
- 闭包

