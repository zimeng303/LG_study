import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/pages/home'

Vue.use(VueRouter)

// 需要给每个请求一个新的 router 实例
export const createRouter = () => {
    const router = new VueRouter({
        mode: 'history', // 同构应用不能使用 hash 路由，应该使用 history 模式
        routes: [
            {
                path: '/',
                name: 'home',
                component: Home
            },
            {
                path: '/about',
                name: 'about',
                // 懒加载路由 按需加载，异步组件
                component: () => import('@/pages/About')
            },
            {
                path: '/posts',
                name: 'posts',
                component: () => import('@/pages/posts')
            },
            {
                path: '*',
                name: 'error404',
                component: () => import('@/pages/404')
            }
        ]
    })

    return router
}