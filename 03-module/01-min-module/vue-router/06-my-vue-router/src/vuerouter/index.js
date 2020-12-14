let _Vue = null

export default class VueRouter {
  /**
     * Vue.use() 注册插件时，调用
     * @param {Vue构造函数} Vue
     */
  static install (Vue) {
    // 1，判断当前插件是否已经被安装
    if (VueRouter.install.installed) {
      return
    }
    VueRouter.install.installed = true
    // 2，把Vue构造函数记录到全局变量中
    _Vue = Vue
    // 3，把创建Vue实例时，传入的 router对象 注入到Vue实例上

    // 混入
    _Vue.mixin({
      beforeCreate () {
        // 判断当前传入的是否是 router 对象，即排除传入组件的情况
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router
          this.$options.router.init()
        }
      }
    })
  }

  // 构造函数
  constructor (options) {
    // 记录构造函数中传入的选项
    this.options = options
    // 将options中传入的 routes(路由规则) 解析出来，然后存储到 routeMap 对象中
    // 键：路由地址 值：路由组件
    // 在 router-view组件中，会根据路由地址在routeMap中找到对应的组件，将其渲染到浏览器中
    this.routeMap = {}
    // 响应式对象，使用 Vue.observable() 创建
    this.data = _Vue.observable({
      current: '/' // 记录当前的路由地址，默认 '/'
    })
  }

  init () {
    this.createRouteMap()
    this.initComponents(_Vue)
    this.initEvent()
  }

  createRouteMap () {
    // 遍历所有的路由规则，把路由规则解析成键值对的形式，存储到 routeMap 中
    this.options.routes.forEach(route => {
      this.routeMap[route.path] = route.component
    })
  }

  // 创建 router-link 和 router-view 组件
  // 传入Vue构造函数
  // 不使用_Vue，减少与外部的依赖
  initComponents (Vue) {
    Vue.component('router-link', {
      props: {
        to: String
      },
      // h 函数，创建虚拟 DOM 
      render (h) {
        /**
         * @param { 创建元素对应的选择器 }
         * @param { 添加标签属性，对象 }
         * @param { 生成标签的子元素，数组 }
         */
        return h('a', {
          attrs: {
            href: this.to,
            on: {
              // 注册点击事件
              click: this.clickHandler
            }
          }
        }, [this.$slots.default]) // 获取默认插槽 this.$slots.default
      },
      methods: {
        clickHandler (e) {
          // 改变浏览器的地址栏，但不向服务器发送请求，只在客户端进行操作
          /**
           * @param data 触发 popstate 事件时，传给 popstate 的事件对象
           * @param title 网页的标题
           * @param url?  地址
           */
          history.pushState({}, '', this.to)
          // 将当前的路径记录到 data.current 中
          // 响应式对象，当值改变时，会自动加载对应的组件，进行渲染视图
          this.$router.data.current = this.to
          // 阻止默认事件
          e.preventDefault()
        }
      }
      // template: '<a :href="to"><slot></slot></a>'
    })
    
    const self = this
    Vue.component('router-view', {
      // h 函数，可以直接把一个组件转换成 虚拟 DOM
      render (h) {
        // 通过当前路由地址，在routeMap中找到对应组件
        const component = self.routeMap[self.data.current] 
        return h(component)
      }
    })
  }

  initEvent () {
    window.addEventListener('popstate', () => {
      this.data.current = window.location.pathname
    })
  }
}
