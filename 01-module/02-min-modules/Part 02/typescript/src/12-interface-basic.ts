// 接口

export {}

// 约定一个对象当中，具体应该有哪些成员，以及成员的类型又是什么样的

/** -- 定义接口的方式
 * interface 关键字 + 接口名 {}
 * 内部成员可用 ";" 分割，也可以不加
 */

interface Post {
    title: string 
    content: string
}

function pointPost (post: Post) {
    console.log(post.title);
    console.log(post.content);   
}

pointPost({
    title: 'Hello TypeScript',
    content: 'A javascript superset'
})