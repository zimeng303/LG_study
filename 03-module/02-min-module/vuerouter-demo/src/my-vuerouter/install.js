import Link from './components/link'
import View from './components/view'

export let _Vue = null
export default function install (Vue) {
  _Vue = Vue
  _Vue.mixins({
    beforeCreate() {
      // this 此处的 this 就是 Vue 的实例
      if (this.$options.router) {
        // 当前的 this 是否是 Vue 的根实例
        this._router = this.$options.router
        this._router.init(this)
        this._routerRoot = this
      } else {
        this._routerRoot = this.$parent && this.$parent._routerRoot
      }
    }
  })
  
  _Vue.component(Link.name, Link)
  _Vue.component(View.name, View)
}