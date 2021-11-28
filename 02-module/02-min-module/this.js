function foo () {
    console.log(this);
}
// 没有调用，this 指向谁都有可能
// foo()      // this => 全局对象(浏览器：window/Node: Global/ES2020: globalThis)
foo.call(1);  // this => 1

const obj1 = {
    foo: function () {
        console.log(this);
    }
}
obj1.foo() // this => obj1

const fn = obj1.foo
fn()       // this => window

const obj2 = {
    foo: function () {
        function bar () {
            console.log(this);
        }
        bar()
    }
}
obj2.foo() // this => 全局对象


const foo1 = {
    bar: {
        // console.log(this);
        baz: function () {
            console.log('1', this);
        }
    }
}
foo1.bar.baz()  // this => foo.bar
