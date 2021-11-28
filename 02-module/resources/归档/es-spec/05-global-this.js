// 'use strict'

// function foo () {
//   console.log(this)
// }

// foo()

// console.log(111)

// return 123

// console.log(222)

// 这里文件中的代码会包裹到 iife （为了实现模块私有作用域）

// console.log(this === module.exports)

function foo () {
  console.log(this)
}

foo()