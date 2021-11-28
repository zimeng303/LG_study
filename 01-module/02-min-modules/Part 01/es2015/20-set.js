// Set 数据结构

// 常见场景：为数组中的元素去重

const s = new Set()

// add() 底层是返回 set对象本身
// s.add(1).add(2).add(3).add(4).add(2)
// console.log(s);

// s.forEach(i => console.log(i))
// for (let i of s) {
//     console.log(i);
// }

// 获取集合长度
// console.log(s.size);

// 判断集合中是否存在某个特定的值
// console.log(s.has(1));
// 删除集合中的某个特定的值
// console.log(s.delete(1));
// 清空集合全部内容
// s.clear()
// console.log(s);

const arr = [1, 2, 1, 3, 4, 2]

// arr 会作为set的初始值，重复值的会被忽略掉
// Array.from() 可以将 Set 再次转换成数组
// const result = Array.from(new Set(arr)) 
// 使用...展开 Set集合
const result = [...new Set(arr)] 
console.log(result);