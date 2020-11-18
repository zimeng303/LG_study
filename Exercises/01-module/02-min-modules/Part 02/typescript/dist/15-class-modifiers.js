"use strict";
// 类的访问修饰符 -- 成员的访问修饰符
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/** -- 类的成员访问修饰符，控制类当中成员的可访问级别
 * private ：私有成员，只能在类的内部进行使用，外部访问不到
 * public ： 公有成员，默认就是 public，建议手动添加上，便于理解
 * protected : 受保护的，外部访问不到，只允许在子类当中访问对应的成员
 */
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
var Student = /** @class */ (function (_super) {
    __extends(Student, _super);
    /** -- 构造函数被私有化
     * 1、构造函数被私有化，将不能在外部使用 new 关键字进行实例化
     * 2、需要在类中定义静态方法，并返回 创建的类的实例
     */
    function Student(name, age) {
        var _this = _super.call(this, name, age) || this;
        console.log(_this.gender);
        return _this;
    }
    Student.create = function (name, age) {
        return new Student(name, age);
    };
    return Student;
}(Person));
var tom = new Person('tom', 18);
console.log(tom.name);
// console.log(tom.age) // 报错
// console.log(tom.gender) // 报错
var jack = Student.create('jack', 20);
//# sourceMappingURL=15-class-modifiers.js.map