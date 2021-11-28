// function a(xx) {
//     this.x = xx
//     return this
// }

// var x = a(5)
// var y = a(6)

// console.log(x.x);
// console.log(y.x);

var length = 10
function fn(){
    console.log(this);
    console.log(this.length);
}

var obj = {
    length: 5,
    method: function(fn) {
        fn()  // 此时的this 指向window，node环境指向global, 10
        arguments[0]() // arguments[0] 相当于arguments.fn, 此时的this执行arguments，
                       // arguments.fn()执行调用，获取的其实是传入的长度
    }
}

obj.method(fn, 1)