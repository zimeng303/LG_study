// 2. div 中放置子元素 h1, p
import {h, init} from 'snabbdom'

// 初始化 patch函数
let patch = init([])

// 创建虚拟 DOM

let vnode = h('div#container', [
    h('h1', 'Hello Snabbdom'),
    h('p', '这是一个p标签')
])

// 创建占位元素
let app = document.querySelector('#app')

// 使用patch()，进行对比，如有变化，则更新视图
let oldVnode = patch(app, vnode)

setTimeout(function () {
    vnode = h('div#container', [
        h('h1', 'Hello World'),
        h('p', 'Hello p')
    ])
    patch(oldVnode, vnode)

    // 清空页面元素 -- 错误的
    // patch(oldVnode, null) // 官网

    patch(oldVnode, h('!')) // 通过 ! 创建注释节点
}, 2000)

