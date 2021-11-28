import History from './base'

export default class HashHistory extends History {
  constructor (router) {
    super(router)
    ensureSlash()
  }

  getCurrentLocation () {
    // 返回当前的路由地址
    return location.hash.substr(1)
  }

  setUpListener () {
    window.addEventListener('hashchange', () => {
      this.transitionTo(this.getCurrentLocation())
    })
  }
}

function ensureSlash () {
  // 判断当前url中是否有hash
  if (location.hash) {
    return
  }
  location.hash = '/'
}
