"use strict";
// 作用域问题
Object.defineProperty(exports, "__esModule", { value: true });
// 编译时，会报错，
// 因为在其他文件中已经在 全局作用域 中定义
/** -- 解决方案
 * 一、使用 匿名函数，立即执行，生成单独的作用域
 * 二、使用 export {}，利用导出模块的概念，生成作用域
 */
// (function () {
//     const a = 123
// })()
var a = 123;
//# sourceMappingURL=03-module-scope.js.map