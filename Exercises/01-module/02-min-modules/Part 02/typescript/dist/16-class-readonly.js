"use strict";
// 类 [class]
Object.defineProperty(exports, "__esModule", { value: true });
var Person = /** @class */ (function () {
    function Person(name, age) {
        this.name = name;
        this.age = age;
        this.gender = true;
    }
    Person.prototype.sayHi = function (msg) {
        console.log("I am " + this.name + ", " + msg);
        console.log(this.age);
    };
    return Person;
}());
var tom = new Person('tom', 18);
console.log(tom.name);
//# sourceMappingURL=16-class-readonly.js.map