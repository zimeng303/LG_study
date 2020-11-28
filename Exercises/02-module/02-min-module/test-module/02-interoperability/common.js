// module.exports = {
//     foo: 'commonjs'
// }

// exports 其实就是 module.exports 的别名，二者是等价的
exports.foo = 'commonjs'

// 不能在 CommonJS 中通过 require 载入 ES Module
// const mod = require('./es-module.mjs')

// console.log(mod);