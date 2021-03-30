import install from './install'
export default class VueRouter {
  constructor (options) {
    this.routes = options.routes || []
  }

  init (app) {

  }
}

VueRouter.install = install
