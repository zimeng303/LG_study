/**
 * 数组类型
 * 
 * @flow
 */

// 泛型
const arr1: Array<number> = [1, 2, 3, 'foo']

const arr2: number[] = [1, 2, 3]

// 元组：一个函数中返回多个返回值时，使用
const foo: [string, number] = ['foo', 100]