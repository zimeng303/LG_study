# 面试题

## 阅读下面代码，分析执行结果，并说明具体原因。

### 问题 1

```js
async function t1() {
  let a = await "lagou";
  console.log(a);
}
t1();
console.log('a')
```

#### 问题解析







`await`是一个表达式，如果后面不是一个 `promise` 对象，会先把表达式转换成promise

```js
function * t1 () {
  let a = yield "lagou"
  console.log(a)
}


const generator = t1()
let result = generator.next()
result.value = Promise.resolve(result.value)
result.value.then(data => {
  generator.next(data)
})
console.log('xx')
```

```js
function * t1 () {
  let a = yield 'lagou'
  console.log(a)
}

co(t1)

function co (generator) {
  const g = generator()
  function handleResult (result) {
    if (result.done) {
      return Promise.resolve(result.value)
    }
    // 如果 yield 后面的值不是 Promise 对象，保证成 Promise 对象
    if (!(result.value instanceof Promise)) {
      result.value = Promise.resolve(result.value)
    }
    return result.value.then(function (data) {
      handleResult(g.next(data))
    })
  }
  return handleResult(g.next())
}
```



### 问题 2

```js
async function t2 () {
  let a = await new Promise((resolve) => {});
  console.log(a); //
}
t2();
```

#### 问题解析

`await`后面如果跟一个 `promise` 对象，`await` 将等待这个 `promise` 对象的 `resolve` 状态的值 `value`，且将这个值返回给前面的变量，此时的 `promise` 对象的状态是一个 `pending` 状态，没有 `resolve` 状态值，所以什么也打印不了。

```js
function * t2 () {
  let a = yield new Promise((resolve) => {});
  console.log(a); //
}
const generator = t2()
const result = generator.next()
result.value.then(v => {
  generator.next(v)
})
```



### 问题 3

```js
async function t3 () {
  let a = await new Promise((resolve) => {
    resolve();
  });
  console.log(a); 
}
t3();
```

#### 问题解析

`await`后面如果跟一个 `promise` 对象，`await` 将等待这个 `promise` 对象的 `resolve` 状态的值 `value`，且将这个值返回给前面的变量，此时的 `promise` 对象的状态是一个 `resolve` 状态，但是它的状态值是` undefined`，所以打印出 `undefined`。

```js
function * t3 () {
  let a = yield new Promise((resolve) => {
    resolve();
  });
  console.log(a); //undefined
}

const generator = t3()
const result = generator.next()
result.value.then(v => {
  generator.next(v)
})
```

#### 问题 4

```js
async function t4 () {
  let a = await new Promise((resolve) => {
    resolve("hello");
  });
  console.log(a); 
}
t4();
```

#### 问题解析

`await`后面如果跟一个 `promise` 对象，`await` 将等待这个` promise` 对象的` resolve` 状态的值，且将这个值返回给前面的变量，此时的` promise` 对象的状态是一个 `resolve` 状态，它的状态值是 `hello`，所以打印出 `hello`。

```js
function * t4 () {
  let a = yield new Promise((resolve) => {
    resolve("hello")
  })
  console.log(a) //hello
}

const generator = t4()
const result = generator.next()
result.value.then(v => {
  generator.next(v)
})
```



### 问题 5

```js
async function t5() {
  let a = await new Promise((resolve) => {
    resolve("hello");
  }).then(() => {
    return "lala";
  });
  console.log(a); //lala
}
t5();
```

#### 问题解析

`await`后面如果跟一个` promise` 对象，`await` 将等待这个 `promise` 对象的 `resolve` 状态的值，且将这个值返回给前面的变量，此时的 `promise` 对象的状态是一个 `resolve` 状态，它的状态值是 `hello`，紧接着后面又执行了一个 `then` 方法，`then` 方法又会返回一个全新的 `promise` 对象，且这个 `then` 方法中的返回值会作为这个全新的 `promise` 中 `resolve` 的值，所以最终的结果是 `lala`。

### 问题 6

```js
async function t6() {
  let a = await fn().then((res) => {
    return res;
  });
  console.log(a); 
}
async function fn() {
  await new Promise((resolve) => {
    resolve("lagou");
  });
}
t6();
```

#### 问题解析

首先考虑 `fn()` 执行返回一个` promise` 对象，因为 `fn `执行没有返回值，所以这个 `promise` 对象的状态 `resolve` 的值是 `undefined`，且将这个 `undefined` 当作下一个 `then` 中回调函数的参数，所以打印的结果是 `undefined`

```js
async function t6() {
  let a = await new Promise(function (resolve) {
    	resolve(undefined)
  	}).then((res) => {
    	return res;
  	});
  console.log(a); //undefined
}
```



### 问题 7

```js
async function t7() {
  let a = await fn().then((res) => {
    return res;
  });
  console.log(a);
}
async function fn() {
  await new Promise((resolve) => {
    resolve("lagou");
  });
  return "lala";
}
t7();
```

#### 问题解析

首先考虑 `fn()` 执行返回一个 `promise` 对象，因为`fn()`执行有返回值` lala`，所以这个 `promise` 对象的状态 `resolve` 的值是 `lala`，且将这个 `lala` 当作下一个 `then` 中回调函数的参数，所以打印的结果是 `lala`。



```js
async function t7() {
  let a = await new Promise(function (resolve) {
    resolve('lala')
  }).then((res) => {
    return res;
  });
  console.log(a); // lala
}

t7();
```



---

## 注意细节

- `async` 函数执行的返回结果是一个 `promise` 对象，这个函数的返回值是这个 `promise` 状态值 `resolve `的值
- `await` 后面如果不是一个 `promise` 对象，将直接返回这个值
- `await` 后面如果是一个 `promise` 对象，将会把这个 `promise` 的状态 `resolve` 的值返回出去。
- 以上没有考虑 `reject` 状态。
