// export var name = 'foo module'

// export function hello () {
//     console.log('hello');
// }

// export class Person {}

var name = 'foo module'

function hello () {
    console.log('hello');
}

class Person {}

// 集中导出成员，可以更加直观的看到向外部导出了哪些成员
export { name, hello, Person }

// 使用 as 进行重命名，导入时要引入重命名后的名称
// 如果 重命名为 default，那么则是要默认导出的成员
// 因为 default 又是关键字，所以导入时必须使用 as 进行重命名
// export {
//     // name as fooName, 
//     hello as fooHello
// }

// 设置某一个成员 默认导出
// 导入时，也可以使用默认导入的方法
// export default name