import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from '@nuxt/ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _69decaf4 = () => interopDefault(import('..\\pages\\layout' /* webpackChunkName: "" */))
const _619a2f29 = () => interopDefault(import('..\\pages\\home' /* webpackChunkName: "" */))
const _5c380342 = () => interopDefault(import('..\\pages\\login' /* webpackChunkName: "" */))
const _7bf699c2 = () => interopDefault(import('..\\pages\\profile' /* webpackChunkName: "" */))
const _0fd1c16d = () => interopDefault(import('..\\pages\\settings' /* webpackChunkName: "" */))
const _5e0ff137 = () => interopDefault(import('..\\pages\\editor' /* webpackChunkName: "" */))
const _ae621328 = () => interopDefault(import('..\\pages\\article' /* webpackChunkName: "" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/",
    component: _69decaf4,
    children: [{
      path: "",
      component: _619a2f29,
      name: "home"
    }, {
      path: "/login",
      component: _5c380342,
      name: "login"
    }, {
      path: "/register",
      component: _5c380342,
      name: "register"
    }, {
      path: "/profile/:username",
      component: _7bf699c2,
      name: "profile"
    }, {
      path: "/settings",
      component: _0fd1c16d,
      name: "settings"
    }, {
      path: "/editor",
      component: _5e0ff137,
      name: "editor"
    }, {
      path: "/article/:slug",
      component: _ae621328,
      name: "article"
    }]
  }],

  fallback: false
}

function decodeObj(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = decode(obj[key])
    }
  }
}

export function createRouter () {
  const router = new Router(routerOptions)

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    const r = resolve(to, current, append)
    if (r && r.resolved && r.resolved.query) {
      decodeObj(r.resolved.query)
    }
    return r
  }

  return router
}
