// 定义promise的三种状态
const PENDING = 'pending'; // 等待
const FULFILLED = 'fulfilled'; // 成功
const REJECTED = 'rejected'; // 失败
class Promise {
    // 传入执行器， 创建实例时，立即执行
    constructor(executor) {
        // 捕获错误
        try {
            executor(this.resolve, this.reject);
        } catch (e) {
            this.reject(e)
        }
    }
    status = PENDING;
    value = undefined;
    reason = undefined;
    successCallback = [];
    failCallback = [];
    // 更改状态 pending --> fulfilled
    resolve = value => {
        // 如果状态不是等待，阻止程序向下执行
        if (this.status !== PENDING) return
        // 将状态更改为成功
        this.status = FULFILLED
        // 保存成功之后的值
        this.value = value
        while (this.successCallback.length) {
            this.successCallback.shift()() // 在成功回调函数中已经进行了操作，因此就不用再传值了
        }
    }
    // 更改状态 pending --> rejected
    reject = reason => {
        // 如果状态不是等待，阻止程序向下执行
        if (this.status !== PENDING) return;
        // 将状态更改为失败
        this.status = REJECTED;
        // 保存失败后的原因
        this.reason = reason;
        while (this.failCallback.length) {
            this.failCallback.shift()() // 在失败回调函数中已经进行了操作，因此就不用再传值了
        }
    }

    then(successCallback, failCallback) {

        // 判断successCallback是否存在，
        // 如果存在时，等于原值；如果不存在，则将值往下进行传递
        // failCallback 同理
        successCallback = successCallback ? successCallback : value => value;
        failCallback = failCallback ? failCallback : reason => reason;

        // 1. 首先实现了 让then方法返回 promise对象
        let promise2 = new Promise((resolve, reject) => {
            if (this.status === FULFILLED) {
                /* 
                    由于这里属于程序运行过程中，而promise2是在程序执行完成后创建的，
                    因此，我们可以将下面的代码使用定时器转换为异步代码。
                    由于我们使用定时器只是为了转换，不是为了延时，因此我们需要将时间设为0
                */
                setTimeout(() => {
                    try {
                        // 成功回调函数，将传入resolve函数中传入的值进行传入
                        // 2. 实现如何把上一个then方法中的回调函数的返回值传递给下一层then方法的回调函数                
                        let x = successCallback(this.value)
                        // x 为成功回调函数的返回值，并将其传递给下一层then方法的回调函数中
                        // 而当我们调用 resolve(x)方法时，其实就是把上一层then方法返回的值传递给下层then方法的成功回调函数
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)

            } else if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = failCallback(this.reason)
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                }, 0)

            } else {
                // 等待期
                this.successCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = successCallback(this.value)
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            // 调用下一个promise的回调函数
                            reject(e);
                        }
                    }, 0)
                })
                this.failCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = failCallback(this.reason)
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0)
                })
            }

        })
        return promise2;
    }

    finally (callback) {
        /* 逻辑分析
            无论当前promise的状态成功还是失败，都要执行callback这个回调函数
            首先，要获取当前 promise对象的状态，可以通过then方法获取；
            然后，需要在finally方法的后面链式调用then方法，要返回一个 promise对象
                  因此可以直接返回then方法返回的 promise对象；
            接着，需要再次调用then方法，需要拿到当前then方法中promise对象的结果，并将其return
            最后，如果promise对象返回的结果中包含异步逻辑，
                  而此时then方法可能不会等到异步操作执行完成，就直接执行了
                  那么需要使用 Promise.resolve()方法，查看一下callback中的返回值，是普通值 还是 promise对象
                  无论是什么，都等待其完成
        */
        return this.then(value => {
            return Promise.resolve(callback()).then(() => value);
        }, reason => {
            callback()
            // 传递错误原因
            return Promise.resolve(callback()).then(reason => { throw reason });
        })
    }

    static all(array) {
        // 一、首先需要返回一个 promise对象实例，并且传入一个生成器，立即执行
        let result = []; // 结果数组
        let index = 0;
        return new Promise((resolve, reject) => {
            /* 逻辑分析
                二、我们需要对传入的数组进行遍历
                三、需要判断数组中的每一项元素是 promise对象 还是普通值
                    1、如果是普通值，那么直接放到结果数组中；
                    2、如果是 promise对象，则需要先执行这个 promise对象，然后再把返回的结果放到结果数组中
            */
            for (let i = 0; i < array.length; i++) {
                let current = array[i];
                if (current instanceof Promise) { // 传入的是 promise对象
                    // 可以链式调用then方法
                    current.then(value => addData(i, value), reason => reject(reason))
                } else { // 普通值
                    addData(i, array[i])
                }
            }
            // 给结果数组赋值
            function addData (key, value) {
                result[key] = value;                
                /* 
                    四、由于for循环的执行是很快的，如果传入的 promise对象中含有异步操作，
                    那么很有可能结果数组中会出现空值的情况 
                    即 [ '1', '2', <1 empty item>, 'p2' ]
                */
                index++;
                // 等待所有异步操作都完成，才要执行resolve
                if (index === array.length) {
                    resolve(result) // 结果数组进行赋值时，才会调用resolve, 使之执行顺序和传入顺序一致
                }
            }
        })
    }

    static resolve (value) {
        /*
            判断 value 是 promise对象，还是普通值
            如果是 promise对象，则直接返回
            如果是 普通值，使用resolve将传入的值进行包裹，然后返回这个新建的 promise对象
        */ 
       if (value instanceof Promise) {
           return value;
       } else {
           return new Promise(resolve => resolve(value));
       }
    }

}

function resolvePromise(promise2, x, resolve, reject) {
    // 判断是否是自己调用自己
    if (promise2 === x) { // 阻止程序往下运行
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
    }

    /** -- 逻辑分析
     * 判断 x 的值是 普通值 还是 promise对象
     * 如果是普通值，直接调用 resolve
     * 如果是 promise对象 查看 promise对象返回的结果
     * 再根据 promise 对象返回的结果 决定调用 resolve  还是调用 reject
     */
    if (x instanceof Promise) {
        x.then(resolve, reject)
    } else {
        resolve(x)
    }
}

module.exports = Promise;