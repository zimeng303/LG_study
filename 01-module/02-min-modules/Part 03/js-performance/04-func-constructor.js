
var fn1 = function () {
    this.foo = function () {
        console.log(1111);
    }
}
let f1 = new fn1()

// 通过原型对象添加方法
var fn2 = function () {}
fn2.prototype.foo = function () {
    console.log(1111);
}

let f2 = new fn2()
