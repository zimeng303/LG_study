/**
 * 特殊类型
 * 
 * @flow
 */

// 字面量类型
const a: 'foo' = 'foo'

// 联合类型：组合
const type: 'success' | 'warning' | 'danger' = 'success'

// 自定义类型别名
const StringOfNumber = string | number

const b: StringOfNumber = 'string' // 100

// ***************************************

const gender: ?number = undefined

// 相当于下面这种写法 Maybe 写法
const gender: number | null | undefined = undefined


