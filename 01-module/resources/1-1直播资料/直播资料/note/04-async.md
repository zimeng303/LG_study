# 面试题

## 阅读下面代码，分析浏览器环境下的执行结果，并说明具体原因。

```javascript
async function async1() {
  console.log("AAAA");
  async2(); 
  console.log("BBBB");
}
async function async2() {
  console.log("CCCC");
}

console.log("DDDD");
setTimeout(function () {
  console.log("FFFF");
}, 0);
async1();
new Promise(function (resolve) {
  console.log("GGGG");
  resolve();
}).then(function () {
  console.log("HHHH");
});
console.log("IIII");
```

## 答案

依次输出：

```
DDDD
AAAA
CCCC
BBBB
GGGG
IIII
HHHH
FFFF
```

## async2 前加上 await

```js
async function async1() {
  console.log("AAAA");
  await async2();  //  await new Promise(function(resolve) { resulve(undefined) })
  console.log("BBBB");
}
async function async2() {
  console.log("CCCC");
}

console.log("DDDD");
setTimeout(function () {
  console.log("FFFF");
}, 0);
async1();
new Promise(function (resolve) {
  console.log("GGGG");
  resolve();
}).then(function () {
  console.log("HHHH");
});
console.log("IIII");
```

结果输出是 DDDD AAAA CCCC GGGG IIII BBBB HHHH FFFF

## 解析

本题考察重点是 js 异步执行、 宏任务、 微任务。
这道题的坑就在于 async 中如果没有 await，那么它就是一个纯同步函数。

这道题的起始代码在第 9 行，输出`DDDD`
第 10 行计时器开启一个异步任务 t1（一个称呼），这个任务且为宏任务。
第 13 行函数`async1`执行，这个函数内没有 await 所以它其实就是一个纯同步函数，打印输出`AAAA`,
在`async1`中执行`async2`函数，因为`async2`的内部也没有 await，所以它也是个纯同步函数，打印输出`CCCC`
紧接着打印输出`BBBB`。
第 14 行 new Promise 执行里面的代码也是同步的,所以打印输出`GGGG`,resolve()调用的时候开启一个异步任务 t2（一个称呼），且这个任务 t2 是微任务，它的执行交给 then()中的第一个回调函数执行，且优先级高于宏任务（t1）执行。
第 20 行打印输出`IIII`,此时线程上的同步任务全部执行结束。
在执行任务队列中的异步任务时，微任务优先于宏任务执行，所以先执行微任务 t2 打印输出 `HHHH`,然后执行宏任务 t1 打印输出 `FFFF`
所以综上 结果输出是 DDDD AAAA CCCC BBBB GGGG IIII HHHH FFFF

