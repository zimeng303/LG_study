// reference count

const user1 = { age: 1 }
const user2 = { age: 2 }
const user3 = { age: 3 }

// 此时的user1、user2、user3的引用计数不是0，不会被回收
const ageList = [user1.age, user2.age, user3.age]

function fn () {
    const num1 = 1
    const num2 = 2
}

fn()  
/**
 * 调用执行结束后，外部将不能访问到 fn函数内的成员，
 * 此时的引用计数变为0，num1和num2所在的内存空间将会被回收掉。
 * 
 */ 