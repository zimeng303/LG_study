// ECMAScript 2017

const obj = {
    foo: 'value1',
    bar: 'value2'
}

// Object.values ************************************************

// 返回对象中所有值组成的数组
// console.log(Object.values(obj));

// Object.entries ***********************************************

// 以数组的形式，返回对象中所有的键值对
// console.log(Object.entries(obj));

// for (const [key, value] of Object.entries(obj)) {
//     console.log(key, value);
// }

// console.log(new Map(Object.entries(obj)));

// 获取对象当中属性的完整描述信息
// Object.getOwnPropertyDescriptors *****************************

// const p1 = {
//     firstName: 'Lei',
//     lastName: 'Wang',
//     get fulName () {
//         return this.firstName + ' ' + this.lastName
//     }
// }

// console.log(p1.fulName);

// const p2 = Object.assign({}, p1)
// p1.firstName = 'zce'
// console.log(p2);

// const descriptors = Object.getOwnPropertyDescriptors(p1)
// console.log(descriptors);

// const p2 = Object.defineProperties({}, descriptors)
// p2.firstName = 'zce'
// console.log(p2.fulName);




// String.prototype.padStart / String.prototype.padEnd **********

// 用给定的字符串去填充目标字符串的开始或结束位置，
// 直到这个字符串达到指定长度为止
const books = {
    html: 5,
    css: 16,
    javascript: 128
}

for (const [name, count] of Object.entries(books)) {
    console.log(`${name.padEnd(16, '-')}|${count.toString().padStart(3, '0')}`);
}

// 在函数参数中添加尾逗号 *******************************************

// function foo (
//     bar,
//     baz,
// ){

// }

const arr = [
    100,
    200,
    300,
]