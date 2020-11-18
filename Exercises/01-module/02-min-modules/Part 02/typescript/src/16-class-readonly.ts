// 类 [class]

export {}

class Person {
    public name: string // = 'init name'
    private age: number 
    protected readonly gender: boolean // readonly 要放在访问修饰符的后面

    constructor (name: string, age: number) {
        this.name = name
        this.age = age
        this.gender = true
    }

    sayHi (msg: string): void {
        console.log(`I am ${this.name}, ${msg}`)        
        console.log(this.age)        
    }
}

const tom = new Person('tom', 18)
console.log(tom.name)

