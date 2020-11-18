// static 关键词

class Person {
    constructor (name) {
        this.name = name
    }

    say () {
        console.log(`hi, my name is ${this.name}`);
    }

    // 静态方法的 this 指向当前的类型
    static create (name) {
        return new Person(name)
    }
}

// new Person().say()
const tom = Person.create('tom')
tom.say()