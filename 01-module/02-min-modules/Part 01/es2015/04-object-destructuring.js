// 对象的解构

const obj = { name: 'zce', age: 18 }

// const { name } = obj
// console.log(name);

// 当解构的属性名 和 同一个作用域的变量同名时
// 使用下面的方式，给解构的属性名添加别名
// const name = 'tom'
// const { name: objName } = obj
// console.log(objName);

// const name = 'tom'
// 添加默认值的写法
// const { name: objName = 'jack' } = obj
// console.log(objName);

const { log } = console
log('foo')
log('bar')
log('123')
