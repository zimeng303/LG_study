let _Vue = null
class Store {
  constructor (options) {
    const { 
      state = {}, // 防止用户没有传入，设置默认值
      getters = {}, 
      mutations = {}, 
      actions = {}
    } = options

    // 将 state 设置成响应式的
    this.state = _Vue.Observable(state)
    /**
     * 此处不直接 this.getters = getters，是因为下面的代码中要 getters 中的 key
     * 如果这么写的话，会导致 this.getters 和 getters 指向同一个对象
     * 当访问 getters 的 key 的时候，实际上就是访问 this.getters 的 key，会触发 key 属性的 getter
     * 会产生死递归
     */ 
    this.getters = Object.create(null)
    Object.keys(getters).forEach(key => {
      Object.defineProperty(this.getters, key, {
        get: () => getters[key](state)
      })
    })
    // 私有属性
    this._mutations = mutations
    this._actions = actions
  }

  // 提交 mutation
  commit (type, payload) {
    this._mutations[type](this.state, payload)
  }

  // 分发 actions
  dispatch (type, payload) {
    this._actions[type](this, payload)
  }
}

// Vue 插件的 install 方法
function install (Vue) {
  _Vue = Vue
  Vue.mixin({
    beforeCreate () {
      // this 指 Vue 实例
      // $options 指 创建 Vue 实例时，传入的参数
      if (this.$options.store) {
        // 将 store 注入到所有的 Vue 实例中
        _Vue.prototype.$store = this.$options.store
      }
    }
  })
}

// 导出模块
export default {
  Store,
  install
}