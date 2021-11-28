// gulp 的入口文件
// 用来定义一些gulp执行的构建任务
// 因为这个文件运行在 nodeJs 环境中，所以可以使用commonJs规范进行代码的编写

// 定义构建任务的方式，就是通过 exports 导出函数成员的方式去定义


// exports.foo = () => {
//     console.log('foo task working~');
// }

// 最新的 gulp中取消了同步代码模式，约定每一个任务都必须是一个异步任务
// 当任务执行完成后，需要通过调用回调函数，或者其它的一些方式去标记这个任务已经完成

exports.foo = done => { // done 是个函数
    console.log('foo task working~');

    done() // 使用回调函数的形式，标识任务完成
}

// Gulp 的默认任务
exports.default = done => { // done 是个函数
    console.log('default task working~');
    done() 
}

// 注意：
// gulp 4.0 以前，注册任务，需要使用Gulp中的一个API
// gulp 4.0 以后保留了这个API , 但是不推荐使用
const gulp = require('gulp')

gulp.task('bar', done => {
    console.log('bar working~');
    done()
})