// Generator 生成器

// function * foo () {
//     console.log('zce');
//     return 100
// }

// const result = foo()
// console.log(result.next());

function * foo () {
    console.log('1111');
    yield 100
    console.log('2222');
    yield 200
    console.log('3333');
    yield 300
}

const generator = foo()

// 生成器函数会自动返回生成器对象
// 调用这个对象的next()方法，才会让这个函数的函数体开始执行
// 执行过程中，一旦遇到yield关键字，函数的执行将会被暂停下来
// yield后面的值将会作为 next 的结果返回
// 如果我们继续调用这个生成器对象的next()方法，那么函数将会从暂停的位置继续执行，周而复始
// 一直到这个函数完全结束，那么next所返回的done的值就会变成true
console.log(generator.next());
console.log(generator.next());
console.log(generator.next());