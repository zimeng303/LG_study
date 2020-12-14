class Watcher {
    constructor (vm, key, cb) {
        this.vm = vm
        // data 中的属性名称
        this.key = key
        // 回调函数负责更新视图
        this.cb = cb

        // 把watcher对象记录到Dep类的静态属性 target
        Dep.target = this
        // 触发get方法，在get方法中会调用addSub
        this.oldValue = vm[key]
        Dep.target = null // 防止重复添加
    }

    // 当数据发生变化的时候更新视图
    update () {
        const newValue = this.vm[this.key]
        if (newValue === this.oldValue) {
            return
        }
        // 当数据变化时，需要将新的值传递给回调函数，更新视图
        this.cb(newValue)
    }
}