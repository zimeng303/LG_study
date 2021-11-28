// 任意类型 [弱类型] 不安全的

export {} // 确保跟其它示例没有成员冲突

function stringify (value: any) {
    return JSON.stringify(value)
}

stringify('string')

stringify(100)

stringify(true)

let foo: any = 'string'

// 在使用过程中，可以接收任意类型的数据
foo = 100

foo.bar() // 语法上不会报错