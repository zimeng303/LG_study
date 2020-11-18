"use strict";
// core-js 基本上把能 polyfill API 都实现了
Object.defineProperty(exports, "__esModule", { value: true });
// Object.defineProperty 完全无法 Polyfill
// Promise 微任务，用宏任务代替
// // import 'core-js/features/object'
// import 'core-js/features/object'
require("core-js");
var tony = {
    name: 'Tony Huang',
    age: 18,
    gender: 'male'
};
var entries = Object.entries(tony);
console.log(entries);
