// 元组 [Tuple]

export {} // 确保跟其它示例没有成员冲突

/** -- 定义元组
 * 使用类似 数组字面量 的形式
 * 如果元素对应类型不相符，或者元素数量不一致，都会报错
 */ 

const tuple: [number, string] = [18, 'foo']

// 访问：
// 一、使用数组下标的形式
// const age = tuple[0]
// const name = tuple[1]

// 二、使用数组解构的方式，提取数组中的每个元素
const [age, name] = tuple

// **************************************

// 返回元组的例子
Object.entries({
    foo: 123,
    bar: 456
})

