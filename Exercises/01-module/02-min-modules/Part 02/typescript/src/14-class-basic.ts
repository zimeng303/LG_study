// 类 [class]

export {}

/**
 * ES2016新增，在类型当中声明属性的方式，就是直接在类中定义
 *
 * 注意：
 *     在TypeScript中，类的属性必须有一个初始值
 * 
 * 属性赋初始值的方式：
 *    1、在 "=" 后面赋值
 *    2、在构造函数中进行初始化，动态的为属性赋值
 */

class Person {
    name: string // = 'init name'
    age: number 

    constructor (name: string, age: number) {
        this.name = name
        this.age = age
    }

    sayHi (msg: string): void {
        console.log(`I am ${this.name}, ${msg}`)        
    }
}