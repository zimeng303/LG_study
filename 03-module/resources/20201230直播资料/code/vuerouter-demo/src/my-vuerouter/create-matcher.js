import createRouteMap from './create-route-map'
import createRoute from './utils/route'

// 返回一个匹配器包含( match  addRoutes )
export default function createMatcher (routes) {
  const { pathList, pathMap } = createRouteMap(routes)
  // console.log(pathList)
  // console.log(pathMap)

  // /music/pop --> route(路由信息对象) { path:xx, matched: [musicRecord, popRecord]}
  function match (path) {
    const record = pathMap[path]
    if (record) {
      return createRoute(record, path)
    }
    return createRoute(null, path)
  }
  // console.log(match('/music/pop'))
  // console.log(match('/xxx'))

  function addRoutes (routes) {
    createRouteMap(routes, pathList, pathMap)
  }

  return {
    match,
    addRoutes
  }
}
