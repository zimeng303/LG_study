const { resolve } = require('../Part 3/myPromise')
const Promise = require('./promise')

let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(111)
    }, 2000)
    // resolve(111)
    // throw new Error('executor error')
    // reject('error')
})
function p1 () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('p1')
        }, 2000)
    })
}
function p2 () {
    return new Promise((resolve, reject) => {
        resolve('p2')
    })
}

// Promise.all(['1', '2', p1(), p2(), '3']).then(value => {
//     console.log(value);
// })

// Promise.resolve(1).then(value => console.log(value))
// Promise.resolve(p2()).then(value => console.log(value))

p2().finally(() => {
    console.log('finally');
    return p1();  // 此处不会打印 'p1',
    // return 100;
}).then(value => {
    console.log(value);
}, reason => {
    console.log(reason);
})