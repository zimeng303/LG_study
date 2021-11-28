var name = 'jack'
var age = 18

// var obj = { name, age }

// export { name, age } // export 单独使用时，不是对象字面量，此处的 {} 是固定语法

// export default { name, age } // export default 组合使用时，{}是对象字面量的范围

export { name, age } // 导出的是值的内存地址

setTimeout(function () {
    name = 'ben'
}, 1000)