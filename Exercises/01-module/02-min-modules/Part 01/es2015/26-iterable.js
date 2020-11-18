// 实现可迭代接口 (Iterable)

const obj = {
    store: ['foo', 'bar', 'baz'],
    // 实现可迭代接口 iterable
    // 内部必须有一个用于返回迭代器的 iterator方法
    [Symbol.iterator]: function () {
        let index = 0
        const self = this
        // iterator 返回的对象实现了 iterable接口
        return {
            // 用于迭代的 next方法
            next: function () {
                // 返回对象 实现的是 迭代结果的接口 iterationaziable
                const result = {
                    value: self.store[index], // 当前被迭代到的数据
                    done: index > self.store.length    // 表示迭代是否结束
                }
                index++
                return result
            }
        }
    }
}

for (const item of obj) {
    console.log('循环体' + item);
}