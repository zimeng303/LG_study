// 迭代器设计模式

// 场景：你我协调开发一个任务清单应用


// 我的代码 *************************

const todos = {
    life: ['吃饭', '睡觉', '打豆豆'],
    learn: ['语文', '数学', '外语'],
    work: ['喝茶'],
    each: function (callback) {
        const all = [].concat(this.life, this.learn, this.work)
        for (const item of all) {
            callback(item)
        }
    },
    // 对外提供迭代接口
    [Symbol.iterator]: function () {
        const all = [...this.life, ...this.learn, ...this.work]
        let index = 0
        return {
            next: function () {
                return {
                    value: all[index],
                    done: index++ >= all.length
                }
            }
        }
    }
}


// 你的代码 *************************

// for (const item of todos.life) {
//     console.log(item);
// }
// for (const item of todos.learn) {
//     console.log(item);
// }
// for (const item of todos.work) {
//     console.log(item);
// }

// todos.each(item => {
//     console.log(item);
// })

for (const item of todos) {
    console.log(item);
}

