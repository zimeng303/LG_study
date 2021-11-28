import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

new Vue({
  // 3. 注册 router 对象
  router, // 会给 Vue 实例，注入两个属性 $route(路由规则)、$router(VueRouter 实例，路由对象)
  render: h => h(App)
}).$mount('#app')
