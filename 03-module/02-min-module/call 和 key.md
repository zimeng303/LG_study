# call

<hr />

**面试题**

```js
function fn1 () {
    console.log(1)
}

function fn2 () {
    console.log(2)
}

// call 的作用
// 调用 call fn1函数，并改变fn1内部的this，将 this 指向 fn2
fn1.call(fn2)
fn1.call.call(fn2)
```

**模拟 call 的实现**

**没有传参**

```js
// 让所有的函数对象，都具有 mycall 方法
// context.fn1()
Function.prototype.mycall = function mycall(context, ...args) {
    // context = context || window
    // ?? 
    // 只有 context 的值是 null 或者 undefined 的时候，才会返回 window
    context = context ?? window
    // 此处的 this 指向的是 fn1 函数
    // 临时把 this 存储进 context.fn 中
    context.fn = this
    const result = context.fn(...args)

    delete context.fn
    return result
}
```

**执行过程**

```js
// fn1.mycall.mycall(fn2)，执行过程
Function.prototype.mycall = function mycall(context, ...args) {
	// context ---> fn2
    context = context ?? window
    // context.fn ---> this ---> mycall
    // fn2.mycall
    context.fn = this
    // 暂停，等待执行 fn2.mycall (没有参数)
    const result = context.fn(...args)

    delete context.fn
    return result
}

// 调用 fn2.mycalll (没传参数)
Function.prototype.mycall = function mycall(context, ...args) {
	// context ---> Window
    context = context ?? window
    // context.fn ---> this ---> fn2
    // window.fn2
    context.fn = this
    // window.fn2 (没有参数)
    const result = context.fn(...args)

    delete context.fn
    return result
}
```

**传入参数**

```js
// context.fn1()
Function.prototype.mycall = function mycall(context, ...args) {
    // 此处要去处理 context 是原始值的问题
    switch (typeof context) {
        case 'number':
            context = new Number(context)
            break
        case 'string':
            context = new String(context)
            break
        case 'boolean':
            context = new Boolean(context)
            break
        default:
            // context = context || window
            context = context ?? window
    }

            // 此处的 this 指向的是 fn1 函数
            // 临时把 this 存储进 context.fn 中
            context.fn = this
            const result = context.fn(...args)

            delete context.fn
            return result
    }

    const obj = { name: 'zs' }
    // fn1.mycall(obj)
    fn1.mycall.mycall(fn2, "1", 2)
}
```



# key 的作用

v-for 中 key 的作用

官方文档：【[https://cn.vuejs.org/v2/api/#key](https://cn.vuejs.org/v2/api/#key)】

单页应用 不利于 SEO

