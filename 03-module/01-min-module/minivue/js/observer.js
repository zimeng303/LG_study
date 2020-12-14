class Observer {
    constructor (data) {
        this.walk(data)
    }

    walk (data) {
        // 1. 判断 data 是否是对象
        if (!data || typeof data !== 'object') {
            return
        }
        // 2. 遍历data对象的所有属性
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }

    // 调用 Object.defineProperty() 将属性转换为 getter / setter
    defineReactive (obj, key, val) {
        const that = this
        // 负责收集依赖，并发送通知
        const dep = new Dep()
        // 如果val是对象，把val内部的属性转换成响应式数据
        this.walk(val)
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get () {
                // 收集依赖
                Dep.target && dep.addSub(Dep.target)
                // 此处不可以写成 obj[key]，否则会发生死递归
                // 这里使用闭包，扩展了val变量的作用域
                return val
            },
            set (newValue) { // function，改变this
                if (newValue === val) {
                    return
                }
                val = newValue
                // 如果newValue是对象，把newValue内部的属性转换成响应式数据
                that.walk(newValue)
                // 发送通知
                dep.notify()
            }
        })
    }
}