# ECMAScript 概述

## JavaScript含义

* @Web

  ECMAScript + Web APIs (BOM、DOM)

* @ Node.js
   ECMAScript + Node APIs (fs、net、etc.)

ECMAScript 2015 (ES2015 | ES6)

async -- ES2017

ES6 泛指 还是 特指

node 12+ 

Nodemon -- 作用：修改完代码后自动执行代码

let  块级作用域
const 比let多一个只读

三个声明关键字：var + const + let

最佳实践：不用var，主用 const，配合 let


数组的解构：根据位置去匹配提取

对象的解构：根据属性名去匹配提取


模板字符串字面量

带标签的模板字符串

字符串的扩展方法 -- 方便字符串查找

   	* includes()
            	* startsWith()
                        	* endsWith()

参数默认值

* // 带有默认值的形参，放在参数的最后面，传入参数是有顺序的

```c

```

function 函数名 ( args = 'default value' ) { }

```

```

```...```

* 剩余参数

​       ...形参名  --> 包含所有的剩余参数，只能放在形参的最后位置，并且只能出现一次

* ES2015 展开数组

箭头函数 

- 比传统函数写法更简洁
- 不会改变 this 指向

对象字面量增强

* 计算属性名

对象扩展方法

* Object.assign：将多个源对象中的属性复制到一个目标对象中
* Object.is: -- 不建议使用

Proxy：代理对象  

​             作用：为对象设置访问代理器。

​                        能够监视到更多对象操作：delete、对对象方法的调用等

​                        更好的支持数组对象的监视

   					 重写数组

​               如何使用 Proxy对象 监视数组

​				Proxy 是以非侵入的方式监管了对象的读写

VS   

Object.defineProperty：

​             作用：只能监视属性的读写



Reflect ： -- 统一的对象操作 API

​				    静态类

​                    Reflect 成员方法就是 Proxy 处理对象的默认实现

​                    统一提供一套用于操作对象的 API

Promise ： 一种更优的异步编程解决方案

​                   链式调用方式，解决了传统异步编程中回调函数嵌套过深的问题

class 类

​				实例方法 ：需要通过这个类型构造的实例对象去调用

​				vs 

​                 静态方法 ：直接通过类型本身去调用

ES2015中新增添加静态成员的 **static** 关键词

类的继承：extends  // 更方便、更清楚

Set 数据结构  -- 集合

Map数据结构：为了解决对象只能使用字符串作为键的问题

​                         它可以使用任何类型数据作为键 

Symbol：一种全新的原始数据类型，表示一个独一无二的值

​              在ES2015之前，对象的属性名都是字符串，而字符串是有可能重复的

​              如果重复，则会产生冲突。

​              作用：

                       * 避免对象属性名相同产生的问题，为对象添加独一无二的属性名
                       * 模拟实现对象的私有成员

截至ES2019，一共 7种数据类型

number、boolean、string、undefined、null、symbol、object

在未来：

BigInt：还未被标准化，一种全新的原始数据类型，用于存放更长的数字

for…of…循环：遍历普通数组、伪数组、set、Map

​						  作为遍历所有数据结构的统一方式

for…in…循环：遍历键值对

Iterator 可迭代接口：实现 Iterable接口就是 for…of 的前提

​								  迭代器模式

生成器 Generator：避免异步编程中回调嵌套过深，提供更好的异步编程解决方案

​                                惰性执行

生成器应用：

ES Modules：语言层面的模块化标准

ECMAScript 2016：

* Array.prototype.includes 方法
* 指数运算符：** -- 2的10次方：2 ** 10

ECMAScript 2017：

* Object.values() ：返回对象中所有值组成的数组
* Object.entries()：以数组的形式，返回对象中所有的键值对
* Object.getOwnPropertyDescriptors() ：获取对象当中属性的完整描述信息
* String.prototype.padStart(指定长度, 替换词) / String.prototype.padEnd(指定长度, 替换词)：用给定的字符串去填充目标字符串的开始或结束位置，直到这个字符串达到指定长度为止
* 在函数参数中添加尾逗号

Async / Await









​    





























