/* @flow */

import { mergeOptions } from '../util/index'

export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    // mergeOptions 将 mixin 中的选项全部拷贝到 this.options 中
    // this --> vue
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
