/**
 * Nuxt.js 配置文件
 * 在 node 中运行
 */

 module.exports = {
     router: {
        base: '/app',
        // routes: 一个数组，路由配置表
        // resolve：解析路由组件路径
        // 自定义路由表
        extendRoutes(routes, resolve) {
            routes.push({
              name: '/hello',
              path: 'hello',
              component: resolve(__dirname, 'pages/user/about.vue')
            })
          }
     }
 }