import Vue from 'vue'
import Vuex from 'vuex'
import products from './modules/products'
import cart from './modules/cart'

// 注册插件
Vue.use(Vuex)

export default new Vuex.Store({
  // 严格模式，会深度检查状态树和不合规的状态改变，会影响性能
  // 注意：在生产模式下，不开启严格模式
  strict: process.env.NODE_ENV !== 'production',
  // 在仓库中设置的状态，在任何组件中都可以使用
  state: {
    // 计数
    count: 0,
    msg: 'Hello Vuex'
  },
  getters: {
    // 参数：state，要处理的状态数据
    // 返回处理完毕的结果，跟计算属性一样
    reverseMsg (state) {
      return state.msg.split('').reverse().join('')
    }
  },
  mutations: {
    // state 参数不需要手动传递
    increate (state, payload) {
      state.count += payload
    }
  },
  actions: {
    // context 执行上下文
    // context 与 store 实例具有相同方法和属性
    // 注意：context 不是 store 的实例
    increateAsync (context, payload) {
      setTimeout(() => {
        context.commit('increate', payload)
      }, 2000)
    }
  },
  modules: {
    // 注册模块
    // 会将 modules 挂载到 store.state 中
    // store.state.模块名称.成员名 访问到模块中的成员
    // 会把模块的mutation 记录到 store 的内部属性 _mutations 中
    // 可以通过 store.commit() 直接提交模块中的 mutation
    products,
    cart
  }
})
