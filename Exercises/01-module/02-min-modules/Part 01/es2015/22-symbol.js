// Symbol 数据类型

// // shared.js *********************

// const cache = {}

// // a.js **************************

// cache['a_foo'] = Math.random()

// // b.js **************************

// cache['b_foo'] = '123'

// console.log(cache);

// const s = Symbol()
// console.log(s);
// console.log(typeof s);

// console.log(
//     Symbol() === Symbol()
// );

// console.log(Symbol('foo'));
// console.log(Symbol('bar'));
// console.log(Symbol('baz'));

// const obj = {}
// obj[Symbol()] = '123'
// obj[Symbol()] = '456'
// console.log(obj);

// const obj = {
//     [Symbol()]: 123
// }
// console.log(obj);

// 模拟实现对象的私有成员

// a.js ***********************

const name = Symbol()
const person = {
    [name]: 'zce',
    say () {
        console.log(this[name]);
    }
}

// b.js ***********************

// person[Symbol()]
person.say()










