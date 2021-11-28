// Proxy 对象

const person = {
    name: 'zce',
    age: 20
}

// 第一个参数是 需要代理的对象
// 第二个参数是 代理的处理对象 
const personProxy = new Proxy(person, {
    // get() 监视属性的访问
    // 两个参数：第一个所代理的目标对象
    //           第二个参数是外部所访问的属性的属性名
    get (target, property) {
        // 返回值 将作为外部访问这个属性得到的结果
        // console.log(target, property)
        return property in target ? target[property] : 'default'
    },
    // set() 监视对象当中设置属性的过程
    // 三个参数，分别是 代理目标对象、要写入的属性名称、要写入的属性值
    set (target, property, value) {
        if (property === 'age') {
            throw new TypeError(`${value} is not an int`)
        }
        // console.log(target, property, value);
        target[property] = value
    }
})

// personProxy.age = 100
personProxy.gender = true

// console.log(personProxy.name);
// console.log(personProxy.xxx);