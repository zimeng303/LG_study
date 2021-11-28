"use strict";
// 类 [class]
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ES2016新增，在类型当中声明属性的方式，就是直接在类中定义
 *
 * 注意：
 *     在TypeScript中，类的属性必须有一个初始值
 *
 * 属性赋初始值的方式：
 *    1、在 "=" 后面赋值
 *    2、在构造函数中进行初始化，动态的为属性赋值
 */
var Person = /** @class */ (function () {
    function Person(name, age) {
        this.name = name;
        this.age = age;
    }
    Person.prototype.sayHi = function (msg) {
        console.log("I am " + this.name + ", " + msg);
    };
    return Person;
}());
//# sourceMappingURL=14-class-basic.js.map