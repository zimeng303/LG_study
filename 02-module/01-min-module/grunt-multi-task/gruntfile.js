module.exports = grunt => {
    // 多目标模式，可以让任务根据配置形成多个子任务

    grunt.initConfig({
        build: {        // 属性名和任务名保持一致，属性值只能为对象形式
            options: {   // options 会作为任务的配置选项出现
                foo: 'bar',
                count: 111
            },
            css: { // 如果目标中也存在配置选项，那么目标中的会覆盖任务中相同属性名的配置选项
                options: {
                    foo: 'baz'
                }
            },   // 每一个属性代表一个目标，除了 options，属性名即为目标名
            js: '2'
        }
    })

    /**
     * registerMultiTask() 方法接收两个参数，
     * 第一个参数，指定任务的名称
     * 第二个参数，指定任务的函数，当任务运行过程中，所要去执行的操作
     *  // 运行多目标
     *  // 运行某一个目标的命令：yarn grunt build:js(目标属性名)
     * 
     */
    grunt.registerMultiTask('build', function () {
        // 获取任务的配置选项
        console.log(this.options());
        // 通过this.target 获取运行目标，
        // 通过this.data 获取配置数据
        console.log(`target: ${this.target}, data: ${this.data}`);
    })
}
