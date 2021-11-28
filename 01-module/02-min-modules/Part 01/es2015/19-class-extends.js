// extends 继承

class Person {
    constructor (name) {
        this.name = name
    }

    say () {
        console.log(`hi, my name is ${this.name}`);
    }
}

class Student extends Person {
    constructor (name, number) {
        super(name) // 始终执向父类，调用它，就是调用父类的构造函数
        this.number = number
    }

    hello () {
        super.say()
        console.log(`my school number is ${this.number}`);
    }
}

const s = new Student('jack', '100')
s.hello()