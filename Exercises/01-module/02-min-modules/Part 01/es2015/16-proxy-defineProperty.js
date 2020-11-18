// Proxy 对比 Object.defineProperty()  

const person = {}

Object.defineProperty(person, 'name', {
    get () {
        console.log('name 被访问')
        return person._name
    },

    set (value) {
        console.log('name 被设置')
        person._name = value
    }
})

Object.defineProperty(person, 'age', {
    get () {
        console.log('age 被访问')
        return person._age
    },

    set (value) {
        console.log('age 被设置')
        person._age = value
    }
})

person.name = 'jack'
console.log(person.name)

const person2 = {
    name: 'zce',
    age: 20
}

const personProxy = new Proxy(person2, {
    // 当外部对这个对象进行delete操作时，会自动执行
    // 两个参数：分别是代理目标对象、要删除的对应属性的属性名称
    deleteProperty (target, property) {
        console.log('delete: ', property);
        delete target[property]
    }
})

delete personProxy.name