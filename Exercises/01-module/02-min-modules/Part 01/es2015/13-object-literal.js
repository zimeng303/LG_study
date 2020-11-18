// 对象字面量

const bar = '345'

const obj = {
    foo: 123,
    // bar: bar
    bar,
    // method1: function () {
    //     console.log('method1');
    // }
    method1 () {
        console.log(this);
    },
    // 计算属性名
    [Math.random()]: 22
}
obj[Math.random()] = 123
console.log(obj);
obj.method1()