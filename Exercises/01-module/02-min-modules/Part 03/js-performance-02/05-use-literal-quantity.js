// new + 构造函数式
var test = () => {
    // 涉及到函数的调用，执行其他操作
    let obj = new Object() // 扩容时，建议构造式
    obj.name = 'zce'
    obj.age = 38
    obj.slogan = '我为前端而活'
    return obj
}

// 字面量
var test = () => {
    // 直接在内存中开辟空间
    let obj = {
        name: 'zce',
        age: 38,
        slogan: '我为前端而活'
    }
    return obj
}

console.log(test())


var str1 = 'zce我为前端而活' // 结果是一个单纯的字符串
 
var str2 = new String('zce我为前端而活') // 结果是一个对象

console.log(str1)
console.log(str2)