export default {
  get<T> (key: string): T | null {
    const json = localStorage.getItem(key)
    if (json == null || json === '') {
      return null
    }
    try {
      // TS C# java 中数据来源于外部，类型都是需要断言的
      return JSON.parse(json) as T
    } catch (e) {
      return null
    }
  },

  set<T> (key: string, value: T) {
    const json = JSON.stringify(value)
    localStorage.setItem(key, json)
  }
}
