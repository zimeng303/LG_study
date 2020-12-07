// 枚举 [Enum]

export {} // 确保跟其它示例没有成员冲突

// js语法：使用对象模拟实现枚举
// const PostStatus = {
//     Draft: 0,
//     Unpublished: 1,
//     Published: 2
// }

// TypeScript语法：使用 enum 关键字
// 注意使用的是 "="
// enum PostStatus {
//     Draft = 0,
//     Unpublished = 1,
//     Published = 2
// }

// 可以不指定具体的值，默认从 0 开始累加
// enum PostStatus {
//     Draft,
//     Unpublished,
//     Published
// }

// 也可以给第一个指定具体的值，
// 那么后面的将会在第一个指定值的基础上，执行累加
// enum PostStatus {
//     Draft = 3,
//     Unpublished,
//     Published
// }

// 给定的值，既可以是数值型，也可以是字符串，即字符串枚举
// 由于字符串无法累加，因此需要自行赋值
// 字符串枚举并不常见
// enum PostStatus {
//     Draft = 'aaa',
//     Unpublished = 'bbb',
//     Published = 'ccc'
// }


// 枚举类型 会入侵到我们平时的代码
// ==> 会影响编译的结果，最终会 编译为双向的键值对 对象
// 目的：可以让我们动态的通过枚举值(0, 1, 2, ...)去获取枚举的名称
const enum PostStatus {
    Draft,
    Unpublished,
    Published
}


const post = {
    title: 'Hello TypeScript',
    content: 'TypeScript is a typed superset of JavaScript.',
    status: PostStatus.Draft // 2 // 1 // 0
}

// PostStatus[0] // =>Draft 通过索引器的形式访问对应的枚举名称

// 如果确定不会使用索引器的形式访问枚举，那么建议使用常量枚举