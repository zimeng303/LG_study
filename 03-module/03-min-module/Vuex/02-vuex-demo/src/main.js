import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store, // store 对象 会注入 Vue 实例中
  render: h => h(App)
}).$mount('#app')

console.log(store)
