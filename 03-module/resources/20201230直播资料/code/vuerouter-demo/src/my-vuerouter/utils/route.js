export default function createRoute (record, path) {
  const matched = []

  // /music/pop --> route(路由信息对象) { path:xx, matched: [musicRecord, popRecord]}
  while (record) {
    matched.unshift(record)
    record = record.parentRecord
  }

  return {
    path,
    matched
  }
}
