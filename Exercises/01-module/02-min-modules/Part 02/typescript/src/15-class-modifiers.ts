// 类的访问修饰符 -- 成员的访问修饰符

export {}

/** -- 类的成员访问修饰符，控制类当中成员的可访问级别
 * private ：私有成员，只能在类的内部进行使用，外部访问不到
 * public ： 公有成员，默认就是 public，建议手动添加上，便于理解
 * protected : 受保护的，外部访问不到，只允许在子类当中访问对应的成员
 */

class Person {
    public name: string // 公有属性
    private age: number  // 私有属性
    protected gender: boolean // 受保护的，只能在子类中被访问

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

class Student extends Person {
    /** -- 构造函数被私有化
     * 1、构造函数被私有化，将不能在外部使用 new 关键字进行实例化
     * 2、需要在类中定义静态方法，并返回 创建的类的实例
     */
    private constructor (name: string, age: number) {
        super(name, age)
        console.log(this.gender);
    }

    static create (name: string, age: number) {
        return new Student(name, age)
    }
}

const tom = new Person('tom', 18)
console.log(tom.name)
// console.log(tom.age) // 报错
// console.log(tom.gender) // 报错

const jack = Student.create('jack', 20)
 
