import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export const createStore = () => {
    return new Vuex.Store({
        // 避免交叉污染
        state: () => {
            posts: []
        },
        mutations: {
            setPosts (state, data) {
                state.posts = data
            }
        },
        actions: {
            // 在服务端渲染期间务必让 action 返回一个 Promise
            // async 默认返回 Promise
            async getPosts ({ commit }) {
                // return new Promise
                const { data } = await axios.get('https://cloud-rest.lenovomm.com/cloud-pc-browser/browser-service-api/stand/weiboList')
                commit('setPosts', data.data)
            }
        }
    })
}