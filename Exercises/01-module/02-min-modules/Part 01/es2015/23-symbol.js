// Symbol 补充

// console.log(
//     Symbol() === Symbol()
//     Symbol('foo') === Symbol('foo') // false
// );

// 使用静态方法for，进行传参，相同的字符串参数就一定会得到相同的Symbol
// 在这个方法中，维护的是字符串和 Symbol 直接的关系
// const s1 = Symbol.for('foo')
// const s2 = Symbol.for('foo')
// console.log(s1 === s2);

// 此时，会将 布尔值的 true 转化为字符串的 'true'
// console.log(
//     Symbol.for(true) === Symbol.for('true') // true
// );

// console.log(Symbol.iterator);
// console.log(Symbol.hasInstance);

// const obj = {
//     [Symbol.toStringTag]: 'XObject'
// }
// console.log(obj.toString());

const obj = {
    [Symbol()]: 'symbol value', // obj 的私有属性
    foo: 'normal value'
}

for (var key in obj) {
    console.log(key);    
}

// 获取字符串类型的键
// console.log(Object.keys(obj));
// console.log(JSON.stringify(obj));

// 获取 Symbol类型的键
console.log(Object.getOwnPropertySymbols(obj));


