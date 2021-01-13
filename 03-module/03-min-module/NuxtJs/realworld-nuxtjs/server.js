const http = require('http')

const server = http.createServer((req, res)=>{
    res.setHeader('Content-Type', 'text/html;charset=utf-8')
    res.end('拉勾教育')
})

server.listen(3000, ()=>{
    console.log('服务器运行了')
})

