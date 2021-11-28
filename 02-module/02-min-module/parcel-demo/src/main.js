// import $ from 'jquery'
import foo from './foo.js'

foo.bar()
import('jquery').then($ => {
    $(document.body).append('<h1>Hello Parcel</h1>')
})

if (module.hot) {
    // accept() 只接收一个回调函数参数，
    // 作用：当前模块更新，或者其所依赖的所有模块更新过后，会自动执行
    module.hot.accept(() => {
        console.log('hmr');
    })
}