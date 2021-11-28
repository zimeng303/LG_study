import createRoute from '../utils/route'

export default class History {
  constructor (router) {
    this.router = router
    this.current = createRoute(null, '/')
    this.cb = null
  }

  listen (cb) {
    this.cb = cb
  }

  transitionTo (path, onComplete) {
    // route --> { path: '', matched: [] }
    this.current = this.router.matcher.match(path)
    this.cb && this.cb(this.current)
    onComplete && onComplete()
  }
}
