// Object 类型

export {} // 确保跟其它示例没有成员冲突

const foo: object = function () {} // [] // {}

// 对象的限制，可以使用对象字面的形式，但是这种前面有几个属性定义，后面就要有几个
// 专业的是使用接口
const obj: { foo: number, bar: string } =  { foo: 123, bar: 'string' }
