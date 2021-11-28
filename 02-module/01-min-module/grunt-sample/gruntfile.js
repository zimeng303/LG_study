// Grunt 的入口文件
// 用于定义一些需要 Grunt 自动执行的任务
// 需要导出一个函数
// 此函数接收一个 grunt 的形参，内部提供一些创建任务时可以用到的 API

module.exports = grunt => {
    /**
     * 使用 grunt 的registerTask() 方法注册任务，接收三个参数
     * 第一个参数，指定任务的名字
     * 第二个参数，若为字符串时，即为任务描述，可选参数
     * 第三个参数，指定任务函数，即当任务发生时，去执行的函数
     */
    grunt.registerTask('foo', () => {
        console.log("hello");
    })

    grunt.registerTask('bar', '任务描述', () => {
        console.log('other task-');
    })
    /**
     * 如果任务名称为default，
     * 则在使用grunt运行任务时，任务名称省略时，会自动调用default
     */
    // grunt.registerTask('default', () => {
    //     console.log('default task-');
    // })

    /**
     * 此时，registerTask() 方法的第二个参数中，可以传入一个数组
     * 当执行default时，grunt 将会依次执行数组中的任务
     */
    grunt.registerTask('default', ['foo', 'bar'])

    // 测试对异步任务的支持
    grunt.registerTask('async-task', () => {
        setTimeout(() => {
            // 使用 grunt 运行异步任务时，并没有打印
            // 因为 grunt 默认支持 同步模式
            console.log('async task working-');
        }, 1000)
    })

    // // 解决 grunt 对异步操作的不支持问题
    grunt.registerTask('async-task', function () {
        // 使用 this 的 async() 方法，
        // 在异步操作完成后，再去调用这个回调函数
        const done = this.async()
        setTimeout(() => {
            console.log('async task working-');
            // 标识这个任务已经被完成，告知grunt这是一个异步任务
            // 使之等待 done 的执行，
            // 直到done()被执行，grunt 才会结束这个任务的执行
            done()
        }, 1000)
    })
}