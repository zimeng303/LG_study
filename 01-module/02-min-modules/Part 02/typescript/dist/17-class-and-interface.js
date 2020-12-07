"use strict";
// 类与接口
Object.defineProperty(exports, "__esModule", { value: true });
// 不同的类型，实现相同的接口
var Person = /** @class */ (function () {
    function Person() {
    }
    Person.prototype.eat = function (food) {
        console.log("\u4F18\u96C5\u7684\u8FDB\u9910\uFF1A" + food);
    };
    Person.prototype.run = function (distance) {
        console.log("\u76F4\u7ACB\u884C\u8D70\uFF1A" + distance);
    };
    return Person;
}());
var Animal = /** @class */ (function () {
    function Animal() {
    }
    Animal.prototype.eat = function (food) {
        console.log("\u547C\u565C\u547C\u565C\u7684\u5403\uFF1A" + food);
    };
    Animal.prototype.run = function (distance) {
        console.log("\u722C\u884C\uFF1A" + distance);
    };
    return Animal;
}());
//# sourceMappingURL=17-class-and-interface.js.map