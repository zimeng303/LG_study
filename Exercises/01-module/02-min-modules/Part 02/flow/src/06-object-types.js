/**
 * 对象类型
 * 
 * @flow
 */

const obj1: { foo: string, bar: number } = { foo: 'string', bar: 100 } 

// ? 表示 可选
const obj2: { foo?: string, bar: number } = { bar: 100 } 

// 指定 键 和 值 的数据类型
const obj3: { [string]: string } = {}

obj3.key1 = 'value1'
obj3.key2 = 'value2'