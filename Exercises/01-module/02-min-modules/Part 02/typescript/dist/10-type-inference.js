"use strict";
// 隐示类型推断
Object.defineProperty(exports, "__esModule", { value: true });
var age = 18; // 默认添加了 number 的类型注解
// age = 'string'
var foo; // any
foo = 100;
foo = 'string';
// 建议为每个变量添加明确的类型
//# sourceMappingURL=10-type-inference.js.map