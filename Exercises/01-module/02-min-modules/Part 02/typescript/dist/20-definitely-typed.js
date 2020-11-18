"use strict";
// 类型声明
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
// 声明函数类型
// 为了兼容普通的js模块
// 安装类型声明模块：
//  yarn add @types/lodash --dev
// 没有实际的代码，只是对对应的模块做一些类型声明
// 若模块中已经存在类型声明，则不需要引入类型声明模块
// declare function camelCase(input: string): string
var res = lodash_1.camelCase('hello typed');
//# sourceMappingURL=20-definitely-typed.js.map