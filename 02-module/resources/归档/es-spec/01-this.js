

// this 快速回顾

// function foo () {
//   console.log(this)
// }

// // foo() // => globalThis

// foo.call(1)

// const obj1 = {
//   foo: function () {
//     console.log(this)
//   }
// }

// obj1.foo() // => obj1
// obj1['foo']()

// const foo = obj1.foo

// foo()

// const obj2 = {
//   foo: function () {
//     function bar () {
//       console.log(this)
//     }
//     bar()
//   }
// }
// obj2.foo()


// function foo () {
//   console.log(this) // => foo {}
// }

// new foo()

// var length = 10
// function fn () {
//   console.log(this) // => [fn, 1, 2]
//   console.log(this.length)
// }

// const obj = {
//   length: 5,
//   method (fn) {
//     // fn() // => window 10
//     // arguments => 实参列表 => [fn, 1, 2]
//     arguments[0]() // => arguments
//   }
// }

// obj.method(fn, 1, 2)

// const o = {}

// o.foo = 123

// o['a b c'] = 123


// const obj1 = {
//   foo: function () {
//     return () => {
//       console.log(this)
//     }
//   }
// }

// obj1.foo()()

// var obj = {
//   func: () => {
//     console.log(this)
//   }
// }

// obj.func()

// class Person {
//   say = () => {
//     console.log(this)
//   }
// }

// function Person () {
//   this.say = () => {
//     console.log(this)
//   }
// }

// const a = new Person()

// a.say()
