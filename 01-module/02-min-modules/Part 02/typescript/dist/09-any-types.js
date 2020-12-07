"use strict";
// 任意类型 [弱类型] 不安全的
Object.defineProperty(exports, "__esModule", { value: true });
function stringify(value) {
    return JSON.stringify(value);
}
stringify('string');
stringify(100);
stringify(true);
var foo = 'string';
// 在使用过程中，可以接收任意类型的数据
foo = 100;
foo.bar(); // 语法上不会报错
//# sourceMappingURL=09-any-types.js.map