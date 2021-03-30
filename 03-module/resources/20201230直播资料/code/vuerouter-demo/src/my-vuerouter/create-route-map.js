export default function createRouteMap (routes, pathList, pathMap) {
  // ||  '' 0 都会被转换成false
  // ?? 只有 undefined或者 null 的时候才会转换成false
  pathList = pathList ?? []
  pathMap = pathMap ?? {}

  routes.forEach(route => {
    addRouteRecord(route, pathList, pathMap)
  })

  return {
    pathList,
    pathMap
  }
}

function addRouteRecord (route, pathList, pathMap, parentRecord) {
  const path = parentRecord ? `${parentRecord.path}/${route.path}` : route.path

  // /music/pop
  const record = {
    path: path,
    component: route.component,
    parentRecord: parentRecord
  }

  if (!pathMap[path]) {
    pathList.push(path)
    pathMap[path] = record
  }

  if (route.children) {
    route.children.forEach(subRoute => {
      addRouteRecord(subRoute, pathList, pathMap, record)
    })
  }
}
