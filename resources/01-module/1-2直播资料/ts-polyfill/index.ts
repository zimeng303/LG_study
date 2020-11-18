// core-js 基本上把能 polyfill API 都实现了

// Object.defineProperty 完全无法 Polyfill
// Promise 微任务，用宏任务代替

// // import 'core-js/features/object'
import 'core-js/features/object'

// import 'core-js'

interface User {
  name: string
  age: number
  gender: 'male' | 'female'
}

const tony: User = {
  name: 'Tony Huang',
  age: 18,
  gender: 'male'
}

const entries = Object.entries(tony)

console.log(entries)