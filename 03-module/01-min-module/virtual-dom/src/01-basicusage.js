import { h, init } from 'snabbdom'

// 1. hello world
// init() 参数：数组，模块
// 返回值：patch函数，作用：对比两个vnode的差异，更新到真实DOM 
let patch = init([])
// 第一个参数：标签 + 选择器
// 第二个参数：如果是字符串的话，就是标签中的内容
//           如果是数组的话，就是创建标签中的子元素，同样是用h()创建
let vnode = h('div#container.cls', {
    hook: {
        init (vnode) {
            console.log(vnode.elm);
        },
        create (emptyVnode, vnode) {
            console.log(vnode.elm);
        }
    }
}, 'Hello World')

const app = document.querySelector('#app')

// 第一个参数：可以是 DOM元素，内部会把DOM元素转换成VNode
// 第二个参数： VNode
// 返回值：VNode
let oldVnode = patch(app, vnode)

// 假设某一时刻，
// 需要从服务器上获取新的数据，并且把新的数据重新赋值给页面的div

vnode = h('div', 'Hello Snabbdom')

patch(oldVnode, vnode)



