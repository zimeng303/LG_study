// import { name } from './module.js'
// import { name } from '/04-import/module.js'

// import { name } from 'htto://localhost:3000//04-import/module.js'

// 加载模块，但不提取模块内的成员
// 一般用于导入一些不需要外部控制的子功能模块
// import {} from './module.js'
// 简写为
// import './module.js'

// 提取模块导出的所有成员, 使用 as 将所有成员作为一个对象的属性
// import * as mod from './module.js'
// console.log(mod.name);


// 动态导入模块, 返回一个 Promise对象

// import('./module.js').then(function (module) {
//     console.log(module);
// })

// 同时导出命名成员和默认成员

import { name, age, default as d } from './module.js'
// 简写为, 默认成员的名字可以随意命名
import d, { name, age } from './module.js'
