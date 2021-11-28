// JavaScript 弱类型产生的问题

// const obj = {}
// obj.foo() // TypeError: obj.foo is not a function

// setTimeout(() => {
//     obj.foo()
// }, 10000)

// *******************************

// function sum (a, b) {
//     return a + b
// }
// console.log(sum(100, 100));
// console.log(sum(100, '100'));

// *******************************

// const obj = {}

// obj[true] = 100

// console.log(obj['true']);
