import Vue from 'vue'
import ElemnetUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Login from './src/Login.vue'


Vue.use(ElemnetUI)

new Vue({
    el: "#app",
    render: h => h(Login)
})