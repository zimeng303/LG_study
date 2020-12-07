// 导入 md 文件的解析模块
const marked = require('marked')

module.exports = source => { // 通过 source 参数，接收输入
    // console.log(source);
    // // 输出结果必须是一段标准的 JavaScript代码
    // return `console.log('hello ~')`

    // 解析 source, 返回值是一串html字符串，即转换后的结果
    const html = marked(source)
    console.log(html);
    // 将其结果进行导出，需要输出 JavaScript 代码
    // return `module.exports = ${JSON.stringify(html)}`
    // return `export default ${JSON.stringify(html)}`

    // 返回 html字符串，交给下一个 loader 处理
    return html
}