"use strict";
// 泛型
Object.defineProperty(exports, "__esModule", { value: true });
function createNumberArray(length, value) {
    // Array 默认创建的是 any类型的数组，因此需要使用泛型进行指定，传递一个类型
    var arr = Array(length).fill(value);
    return arr;
}
function createStringArray(length, value) {
    var arr = Array(length).fill(value);
    return arr;
}
// 不明确的类型，使用 T 替换，调用时传入
function createArray(length, value) {
    var arr = Array(length).fill(value);
    return arr;
}
// const res = createNumberArray(3, 100) // res => [100, 100, 100]
var res = createArray(3, 'foo');
//# sourceMappingURL=19-generics.js.map