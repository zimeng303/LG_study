// 抽象类

export {}

// 抽象类只能被继承，不能再使用 new 进行实例化
abstract class Animal {
    eat (food: string): void {
        console.log(`呼噜呼噜的吃：${food}`)        
    }

    // 抽象方法, 不需要方法体
    abstract run (distance: number): void 
}

// 当父类中存在抽象方法时，子类必须去实现抽象方法
class Dog extends Animal {
    run(distance: number): void {
        console.log('四脚爬行', distance);
    }

}

// 子类创建实例时，会同时拥有父类中的方法，以及自身所实现的方法
const d = new Dog()
d.eat('嗯')
d.run(1)