// Reflect 对象

// const obj = {
//     foo: '123',
//     bar: '456'
// }

// const proxy = new Proxy(obj, {
//     get (target, property) {
//         console.log('watch logic-')
//         return Reflect.get(target, property)
//     }
// })

// console.log(proxy.foo);


const obj = {
    name: 'ace',
    age: 18
}

// console.log('name' in obj); // obj 中是否存在 'name' 属性
// console.log(delete obj['age']);
// console.log(Object.keys(obj)); // 获取 obj 中所有的key值

console.log(Reflect.has(obj, 'name'));
console.log(Reflect.deleteProperty(obj, 'age'));
console.log(Reflect.ownKeys(obj));