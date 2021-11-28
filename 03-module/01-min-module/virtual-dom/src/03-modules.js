import { h, init } from 'snabbdom'

// 1. 导入模块
import style from 'snabbdom/modules/style'
import eventlisteners from 'snabbdom/modules/eventlisteners'

// 2. 注册模块
let patch = init([
    style,
    eventlisteners
])

// 3. 使用 h() 函数的第二个参数，传入模块需要的数据(对象)
let vnode = h('div', {
    // 设置行内样式
    style: {
        backgroundColor: 'red'
    },
    // 注册事件
    on: {
        click: eventHandler
    }
}, [
    h('h1', 'Hello Snabbdom'),
    h('p', '这是p标签')
])

function eventHandler () {
    console.log('点击我了');
}
const app = document.querySelector('#app')

patch(app, vnode)