// 箭头函数 与 this

const person = {
    name: 'tom',
    // sayHi: function () {
    //     console.log(`hi, my name is ${this.name}`);
    // }
    sayHi: () => {
        console.log(`hi, my name is ${this.name}`);
        console.log(this); // {}
    },
    sayHiAsync: function () {
        // setTimeout(function () {
        //     console.log(this.name);
        // }, 1000)
        setTimeout(() => {
            console.log(this.name);
        }, 1000)
    }
}
person.sayHi()