// reference

let obj = {name: 'xm'}  // 可达的

let ali = obj // 引用数值变化

obj = null    // 依然是 可达对象，因为 ali 还在引用
