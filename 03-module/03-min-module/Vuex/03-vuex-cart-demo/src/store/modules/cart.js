const state = {
  // 记录所有的购物车数据
  cartProducts: []
}

const getters = {
  totalCount (state) {
    return state.cartProducts.reduce((sum, prod) => sum + prod.count, 0)
  },
  totalPrice (state) {
    return state.cartProducts.reduce((sum, prod) => sum + prod.totalPrice, 0)
  }
}

const mutations = {
  addToCart (state, product) {
    // 1. cartProducts 中没有该商品，把该商品添加到数组中，并增加 count, isChecked, totalPrice
    // 2. cartProducts 有该商品，让商品数量加1，选中，计算小计
    const prod = state.cartProducts.find(item => item.id === product.id)

    if (prod) {
      prod.count++
      prod.isChecked = true
      prod.totalPrice = prod.count * prod.price
    } else {
      state.cartProducts.push({
        // { id, title, price }
        ...product,
        count: 1,
        isChecked: true,
        totalPrice: product.price
      })
    }
  },
  deleteFromCart (state, productId) {
    const index = state.cartProducts.find(item => item.id === productId)
    index !== -1 && state.cartProducts.splice(index, 1)
  },
  // 改变所有商品的 isChecked 属性
  // checked 当前 checkbox 的状态
  updateAllProductChecked (state, checked) {
    state.cartProducts.forEach(item => {
      item.isChecked = checked
    })
  },
  updateProductChecked (state, {
    checked,
    prodId
  }) {
    const prod = state.cartProducts.find(prod => prod.id === prodId)
    prod && (prod.isChecked = checked)
  },
  updateProduct (state, {
    prodId,
    count
  }) {
    const prod = state.cartProducts.find(prod => prod.id === prodId)
    if (prod) {
      prod.count = count
      prod.totalPrice = count * prod.price
    }
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
