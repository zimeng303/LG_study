// business routes
import mainRoutes from './main-routes'
// demo routes
import demoRoutes from './demo-routes'

/**
 * 路由表配置
 * @type {import('vue-router').RouteConfig[]}
 */
const routes = [
  // ## login page
  {
    name: 'login',
    path: '/login',
    meta: { requireAuth: false },
    component: () => import(/* webpackChunkName: 'login' */ '../views/login')
  },
  // ## main page
  {
    path: '/',
    meta: { requireAuth: true },
    component: () => import(/* webpackChunkName: 'common' */ '../views/layout'),
    children: mainRoutes.concat(demoRoutes)
  },
  // ## not found page
  {
    name: 'not-found',
    path: '*',
    meta: { requireAuth: false },
    component: () => import(/* webpackChunkName: 'common' */ '../views/error')
  }
]

export default routes
