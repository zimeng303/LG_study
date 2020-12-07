// ES Module 中可以导入 CommonJs 模块

// import mod from './common.js'
// console.log(mod);

// commonJS 导出的是默认成员
// 不能直接提取成员，注意 import 不是解构导出对象

import { foo } from './common.js'
console.log(foo);

// export const foo = 'es module export value'