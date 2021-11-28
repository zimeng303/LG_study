import axios from 'axios'

const state = {
  // 定义所有商品数据
  products: []
}

const getters = {

}

const mutations = {
  // 定义方法，修改商品数据
  setProducts (state, payload) {
    state.products = payload
  }
}

const actions = {
  // 异步向接口请求商品数据
  async getProducts ({ commit }) {
    const { data } = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/products'
    })
    commit('setProducts', data)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
