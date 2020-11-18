// Map 数据结构

const obj = {}

obj[true] = 'value'
obj[123] = 'value'
obj[{ a: 1 }] = 'value'

// 默认 toString() 执行结果后的字符串作为键
console.log(Object.keys(obj));


// Map就是为了解决这种问题
// Map才能算是严格意义上的键值对集合，
// 用来映射两个任意类型数据直接的对应关系

const m = new Map()
const tom = { name: 'tom' }

m.set(tom, 90)
console.log(m);

console.log(m.get(tom));

// console.log(m.has(tom)); 
// m.delete()
// m.clear()

// 第一个参数为值，第二个参数为键
m.forEach((value, key) => {
    console.log(value, key);
})


















