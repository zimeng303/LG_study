import Vue from 'vue'
import Vuex from 'vuex'
import products from './modules/products'
import cart from './modules/cart'

Vue.use(Vuex)

// 定义插件
const myPlugin = store => {
  // 订阅 store 中的 mutation ，每次 mutation 之后调用
  store.subscribe((mutation, state) => {
    // 只处理 cart 中的 mutation
    if (mutation.type.startsWith('cart/')) {
      window.localStorage.setItem('cart-products', state.cartProducts)
    }
  })
}

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    products,
    cart
  },
  // 注册插件
  plugins: [myPlugin]
})
