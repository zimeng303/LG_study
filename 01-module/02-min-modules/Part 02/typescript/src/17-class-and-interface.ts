// 类与接口

export {}

// 一个接口只去约束一个能力，让一个类型同时去实现多个接口
interface Eat {
    eat (food: string): void
}
interface Run {
    run (distance: number): void
}

// 不同的类型，实现相同的接口
class Person implements Eat, Run {
    eat (food: string): void {
        console.log(`优雅的进餐：${food}`)        
    }

    run (distance: number) {
        console.log(`直立行走：${distance}`)
    }
}

class Animal implements Eat, Run {
    eat (food: string): void {
        console.log(`呼噜呼噜的吃：${food}`);        
    }

    run (distance: number) {
        console.log(`爬行：${distance}`)        
    }
}