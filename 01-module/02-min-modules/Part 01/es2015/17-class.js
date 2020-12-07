// class 关键词

// function Person (name) {
//     this.name = name
// }

// Person.prototype.say = function () {
//     console.log(`hi, my name is ${this.name}`);
// }

// new Person().say()

class Person {
    constructor (name) {
        this.name = name
    }

    say () {
        console.log(`hi, my name is ${this.name}`);
    }
}

new Person().say()