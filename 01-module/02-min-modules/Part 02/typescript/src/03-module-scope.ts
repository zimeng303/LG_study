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