export default {
  name: 'RouterView',
  render (h) {
    const route = this.$route
    // /music/pop
    // route ---->  { path: '', matched: [parentRecord, childRecord] }
    let depth = 0
    // 给当前的routerView 组件做一个标记
    this.isRouterView = true
    let parent = this.$parent
    while (parent) {
      if (parent.isRouterView) {
        depth++
      }
      parent = parent.$parent
    }

    const record = route.matched[depth]
    if (record) {
      return h(record.component)
    }

    return h()
  }
}
