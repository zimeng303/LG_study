/**
 * 类型注解
 * 
 * @flow
 */

function square (n: number) {
    return n * n
}

let name: number = 100

// name = 'string'

// 没有返回值的类型 void
function foo (): void {
    // return 100
    // return 'string'
}

