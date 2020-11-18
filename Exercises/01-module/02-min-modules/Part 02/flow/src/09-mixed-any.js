/**
 * Mixed any
 * 
 * @flow
 */

// 所有类型的联合类型
// string | number | boolean | ...

// 强类型，类型安全的
function passMixed(value: mixed) {
    // 解决类型隐患
    if (typeof value === 'string') {
        value.substr(1)
    }
    if (typeof value === 'number') {
        value * value
    }
}

passMixed('string')

passMixed(100)

// *********************************

// 弱类型 兼容以前版本的ECMAScript 
function passAny(value: any) {
    value.substr(1) // 语法上不会报错

    value * value
}

passAny('string')

passAny(100)