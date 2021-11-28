// 将这三个未被导出的成员函数，看成是私有的任务
// 此时，无法通过 gulp 直接去运行他们

const { series, parallel } = require('gulp')


const task1 = done => {
    setTimeout(() => {
        console.log('task1 working~');
        done()
    }, 1000)
}

const task2 = done => {
    setTimeout(() => {
        console.log('task2 working~');
        done()
    }, 1000)
}

const task3 = done => {
    setTimeout(() => {
        console.log('task3 working~');
        done()
    }, 1000)
}

// series 是一个函数，每一个参数都可以是一个任务
// 依次执行每一个任务，串行的任务，比如项目部署，需要先执行编译的任务，再进行部署
exports.foo = series(task1, task2, task3)

// parallel 实现并行的任务，同时启动任务，比如同时编译js和css
exports.bar = parallel(task1, task2, task3)

// 对实际创建构建工作流很有用