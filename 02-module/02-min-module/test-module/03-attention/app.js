// 如果模块中是以对象字面量的形式，进行导出的，导入时，不是对象的解构
// import module from './module.js'

// console.log(module.name);

// {} 固定语法
import { name, age } from './module.js'

console.log(name, age);
name = 'tom' // 导出的值是只读的，无法在模块外部修改成员

setTimeout(function () {
    console.log(name, age);
}, 1500)