// 如何使用 Proxy对象 监视数组

const list = []

const listProxy = new Proxy(list, {
    set (target, property, value) {
        console.log(target, property, value)
        target[property] = value
        return true   // 表示设置成功
    }
})
listProxy.push(100)