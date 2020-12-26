/* @flow */

import config from 'core/config'
import { warn, cached } from 'core/util/index'
import { mark, measure } from 'core/util/perf'

// 导入 vue 的构造函数
import Vue from './runtime/index'
import { query } from './util/index'
import { compileToFunctions } from './compiler/index'
import { shouldDecodeNewlines, shouldDecodeNewlinesForHref } from './util/compat'

const idToTemplate = cached(id => {
  const el = query(id)
  return el && el.innerHTML
})

// 保留 Vue 实例的 $mount 方法
const mount = Vue.prototype.$mount

// 重写 ./runtime/index 文件中的 $mount 
// $mount 将生成的代码挂载到页面中
Vue.prototype.$mount = function (
  // el: 创建 vue 实例时，传入的选项
  el?: string | Element,
  // 非 SSR 情况下为 false，SSR 时为 true
  hydrating?: boolean
): Component {
  // 获取 el 对象，即 DOM 对象
  // query()，判断el是选择器 还是真实 DOM，若为选择器时，则手动查找，找不到时，则创建
  el = el && query(el)

  /* istanbul ignore if */
  // el 不能是 body 或者 html
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  // 创建 vue 实例时，传入的选项
  const options = this.$options

  // resolve template/el and convert to render function
  // 把 template/el 转换成 render 函数
  if (!options.render) { // 不存在 render 函数时
    let template = options.template // 获取传入的 template 选项

    // 如果模板存在
    if (template) {
      if (typeof template === 'string') {        
        // 如果模板是 id 选择器
        if (template.charAt(0) === '#') { // charAt() 方法可返回指定位置的字符。
          // 获取对应的 DOM 对象的 innerHTML
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        // 如果模板是元素，返回元素的 innerHTML
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        // 否则返回当前实例
        return this
      }
    } else if (el) {
      // 如果没有 template，获取 el 的 outerHTML 作为模板
      template = getOuterHTML(el)
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }

      // 把 template 转换成 render 函数
      const { render, staticRenderFns } = compileToFunctions(template, {
        outputSourceRange: process.env.NODE_ENV !== 'production',
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  // 调用 mount 方法，渲染 DOM，将 this 指向当前的 Vue 实例
  return mount.call(this, el, hydrating)
}

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el: Element): string {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}

// 静态方法 compile 编译，把 模板字符串 编译为 render 函数
Vue.compile = compileToFunctions

// 导出 Vue 构造函数
export default Vue
