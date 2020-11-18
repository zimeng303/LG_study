// var a = []

// for (var i = 0; i < 10; i++) {
//     a[i] = function () {
//         console.log(i);
//     }
// }
// a[6]() // 10

// var tmp = 123

// if (true) {
//     console.log(tmp);
//     let tmp
// }

// var arr = [12, 34, 32, 89, 4]
// console.log(Math.min(...arr))


var a = 10
var obj = {
    a: 20,
    fn () {
        // setTimeout(() => {
        //     console.log(this.a);  // 20
        // })
        setTimeout(function () {
            console.log(this.a);  // 10
        })
    }
}
obj.fn()





