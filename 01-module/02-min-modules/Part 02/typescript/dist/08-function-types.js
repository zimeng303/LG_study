"use strict";
// 函数类型
Object.defineProperty(exports, "__esModule", { value: true });
/** -- 定义函数的两种方式
 * 一、函数声明
 * 二、函数表达式
 */
/** -- 函数声明
 * 如果某个参数可传可不传：
 *    1、可在形参的参数名后面添加 "?" , 使其变成可选的；
 *    2、使用 es6中添加参数默认值的方法, 使其变成可有可无的。
 *
 * 若需要接收任意个数的参数，使用 es6 中的rest操作符
 *
 * 注意：
 *    1、形参列表都为必传参数时，传入的实参类型和数量，都必须与形参保持一致
 *    2、可选参数，必须放在参数列表的最后面
 */
function func1(a, b, c) {
    if (c === void 0) { c = 10; }
    var rest = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        rest[_i - 3] = arguments[_i];
    }
    return 'func1';
}
func1(100, 200);
// *********************************************
/** -- 函数表达式
 * 这种对于回调函数的形参类型，需要进行约束
 */
var fun2 = function (a, b) {
    return 'func2';
};
//# sourceMappingURL=08-function-types.js.map