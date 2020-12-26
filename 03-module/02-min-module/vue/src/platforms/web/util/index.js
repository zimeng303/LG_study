/* @flow */

import { warn } from 'core/util/index'

export * from './attrs'
export * from './class'
export * from './element'

/**
 * Query an element selector if it's not an element already.
 */
export function query (el: string | Element): Element {
  if (typeof el === 'string') {
    // el 是 选择器
    const selected = document.querySelector(el)
    if (!selected) {
      // 如果查询标签不存在
      process.env.NODE_ENV !== 'production' && warn(
        'Cannot find element: ' + el
      )
      // 创建div标签
      return document.createElement('div')
    }
    return selected
  } else { 
    // el 是 DOM 选项
    return el
  }
}
