// ES2018
// + 展开和剩余在对象上的应用 ======================================================

const obj = { one: 1, two: 2, three: 3, four: 4, five: 5 }
const { one, four, ...rest } = obj
// one => 1, four => 4
// rest => { two: 2, three: 3, five: 5}

const obj2 = { foo: 'bar', ...rest }
// obj2 => { foo: 'bar', two: 2, three: 3, five: 5}

const obj3 = { foo: 'bar', two: 200, ...rest }
// obj3 => { foo: 'bar', two: 2, three: 3, five: 5}

const obj4 = { foo: 'bar', ...rest, two: 200 }
// obj4 => { foo: 'bar', two: 200, three: 3, five: 5}

// Object.assign({}, {})

// + 正则表达式的增强 =============================================================

// 环视
const intro = '张三是张三，张三丰是张三丰，张三不是张三丰，张三丰也不是张三'

// const reg = /张三[^丰]/

// 向后否定 正向肯定
// const res = intro.replace(/张三(?!丰)/g, '李四')
// 向后肯定 正向肯定
const res = intro.replace(/张三(?=丰)/g, '李四')

// 'A00 B00'.replace(/(?<=A)00/g, '88')
// 'A00 B00'.replace(/(?<!A)00/g, '88')

console.log(res)


// 正则组命名
const date = '2020-05-20'
const reg = /(?<year>\d{4})-(?<mouth>\d{2})-(?<day>\d{2})/
const res = reg.exec(date)
console.log(res)


// + Promise.prototype.finally() ===============================================

new Promise((resolve, reject) => {
  setTimeout(() => {
    const now = Date.now()
    now * 2 ? resolve(now) : reject(now)
  }, 1000)
})
.then(now => {
  console.log('resolved', now)
})
.catch(now => {
  console.log('rejected', now)
})
.finally(now => {
  console.log('finally', now)
})


// for await...of 异步迭代器 迭代循环
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for-await...of

// 01. 迭代器（Iterator）=========================================================

// function createIdMaker (max) {
//   let index = 1
//   return {
//     next () {
//       if (index > max) return { done: true }
//       return { value: index++, done: false }
//     }
//   }
// }

// const idMaker = createIdMaker(2)

// console.log(idMaker.next())
// console.log(idMaker.next())
// console.log(idMaker.next())

// 02. 可迭代对象（Iterable）======================================================

// const idMaker = {
//   max: 10,
//   [Symbol.iterator] () {
//     let index = 1
//     const self = this
//     return {
//       next () {
//         if (index > self.max) return { done: true }
//         return { value: index++, done: false }
//       }
//     }
//   }
// }

// for (const item of idMaker) {
//   console.log(item)
// }

// 03. 生成器函数（Generators）====================================================

// function * createIdMaker (max) {
//   for (let i = 1; i <= max; i++) {
//     yield Promise.resolve(i) // 进程 线程 仟程
//   }
// }

// const idMaker = createIdMaker(10)

// for await (const item of idMaker) {
//   console.log(item)
// }

// 04. 异步可迭代对象 ============================================================

// const idMaker = {
//   max: 10,
//   [Symbol.asyncIterator] () {
//     let index = 1
//     const self = this
//     return {
//       next () {
//         if (index > self.max) return Promise.resolve({ done: true })
//         return Promise.resolve({ value: index++, done: false })
//       }
//     }
//   }
// }

// ;(async () => {
//   for await (const item of idMaker) {
//     console.log(item)
//   }
// })()

// 04. 异步生成器（Async Generators）==============================================

// function * createIdMaker (max) {
//   for (let i = 1; i <= max; i++) {
//     yield Promise.resolve(i)
//   }
// }

// ;(async () => {
//   const idMaker = createIdMaker(10)
//   for await (const item of idMaker) {
//     console.log(item)
//   }
// })()




// 案例 ==============================================

async function * getNext (max) {
  let current = 0
  let data = []
  while (current < max) {
    const url = `https://api.github.com/events?page=${current++}&per_page=1`
    const response = await fetch(url)
    data = await response.json()
    yield data[0]
  }
}

for await (const item of getNext(4)) {
  console.log(item)
  if (item.id > 1000) {
    break
  }
}
