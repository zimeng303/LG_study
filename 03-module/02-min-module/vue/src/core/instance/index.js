import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

// 此处不用 class 的原因，是因为方便后续给Vue 实例混入实例成员
// 1，创建 Vue 构造函数
function Vue (options) {
  // 开发环境
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue) // this 是否指向 Vue 的实例
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  // 调用 _init() 方法
  this._init(options)
}

// 2，注册 Vue 实例成员

// 注册 vm 的 _init() 方法，初始化 vm
initMixin(Vue)

// 注册 vm 的属性：$data/$props 
// 注册 vm 的方法：$set/$delete/$watch
stateMixin(Vue)

// 初始化事件相关方法
// $on/$once/$off/$emit
eventsMixin(Vue)

// 初始化生命周期相关的混入方法
// _update()/$forceUpdate/$destroy
lifecycleMixin(Vue)

// 混入 render
// $nextTick/_render
renderMixin(Vue)

export default Vue
