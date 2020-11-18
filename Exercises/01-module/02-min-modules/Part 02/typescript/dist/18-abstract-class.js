"use strict";
// 抽象类
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
// 抽象类只能被继承，不能再使用 new 进行实例化
var Animal = /** @class */ (function () {
    function Animal() {
    }
    Animal.prototype.eat = function (food) {
        console.log("\u547C\u565C\u547C\u565C\u7684\u5403\uFF1A" + food);
    };
    return Animal;
}());
// 当父类中存在抽象方法时，子类必须去实现抽象方法
var Dog = /** @class */ (function (_super) {
    __extends(Dog, _super);
    function Dog() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Dog.prototype.run = function (distance) {
        console.log('四脚爬行', distance);
    };
    return Dog;
}(Animal));
// 子类创建实例时，会同时拥有父类中的方法，以及自身所实现的方法
var d = new Dog();
d.eat('嗯');
d.run(1);
//# sourceMappingURL=18-abstract-class.js.map