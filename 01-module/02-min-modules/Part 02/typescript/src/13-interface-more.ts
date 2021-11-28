// 接口

export {}

interface Post {
    title: string 
    content: string
    subtitle?: string   // ? 可选成员
    readonly summary: string // 只读成员
}

const hello: Post = {
    title: 'Hello TypeScript',
    content: 'A javascript superset',
    summary: 'A javascript'
}

// hello.summary = 'other' // 不可修改

// ********************************************

// 添加动态成员
interface Cache {
    [key: string]: string // key 代表属性名，可随意取名
}

const cache: Cache = {}

cache.foo = 'value1'
cache.bar = 'value2'
