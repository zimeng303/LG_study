import Vue from 'vue'
import App from './App.vue'
// import { Foo } from './types'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

// const f: Foo = { name: '123' }