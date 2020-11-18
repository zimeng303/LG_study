"use strict";
// 类型断言
Object.defineProperty(exports, "__esModule", { value: true });
// 假设这个 nums 来自一个明确的接口
var nums = [110, 120, 119, 112];
var res = nums.find(function (i) { return i > 0; });
// TypeScript 推断出 res: number | undefined
// 此时，就不能执行类似操作
// const square = res * res 
/** -- 断言的两种方式
 * 一、使用 as 关键字，明确告诉 TypeScript 这个数据的具体类型
 * 二、使用 <数据类型> 的方式，但 JSX下会有语法冲突，不能使用
 */
var num1 = res;
var num2 = res;
//# sourceMappingURL=11-type-assertion.js.map