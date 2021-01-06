const express = require('express')
const fs = require('fs')
const template = require('art-template')

const app = express()

app.get('/', (req, res) => {
    // 1. 获取页面模板
    const templateStr = fs.readFileSync('./index.html', 'utf-8')
    // 2. 获取数据
    const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'))
    // 3. 渲染：数据 + 模板
    const html = template.render(templateStr, data)

    console.log(html)
    // 4. 把渲染结果发送给客户端
    res.send(html)
})

app.listen(3000, () => console.log('running......'))