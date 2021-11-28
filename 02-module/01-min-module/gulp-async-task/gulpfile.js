const fs = require('fs')

exports.callback = done => {
    console.log('callback task~');
    done()
}

// 错误优先回调函数，即后面的任务不会再执行
exports.callback_error = done => {
    console.log('callback task~');
    done(new Error('task falied!'))
}

exports.promise = () => {
    console.log('promise task~')
    return Promise.resolve() // 成功，意味着任务结束
}

exports.promise_error = () => {
    console.log('promise task~')
    return Promise.reject(new Error('task failed')) // 失败，任务结束
}

const timeout = time => {
    return new Promise(resolve => {
        setTimeout(resolve, time)
    })
}
// async await 是 Promise 的语法糖
// 要求 node 8+
exports.async = async () => {
    await timeout(1000)
    console.log('async task~');
}


// 最常用的一种方式

// exports.stream = () => {
//     const readStrem = fs.createReadStream('package.json')
//     const writeStream = fs.createWriteStream('temp.txt')
//     readStrem.pipe(writeStream)
//     return readStrem
// }

exports.stream = done => {
    const readStrem = fs.createReadStream('package.json')
    const writeStream = fs.createWriteStream('temp.txt')
    readStrem.pipe(writeStream)
    readStrem.on('end', () => {
        done()
    })
}


const error = () => {
    return new Promise((resolve, reject) => {
        reject(new Error('task failed'))
    })
}

exports.async_error = async () => {
    await error()
    console.log('async task~');
}