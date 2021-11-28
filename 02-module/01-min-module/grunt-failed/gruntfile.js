module.exports = grunt => {
 
    grunt.registerTask('bad', () => {
        console.log('bad workding-');
        // 返回false，则表示任务失败
        return false
    })

    grunt.registerTask('foo', () => {
        console.log('foo task-');
    })

    grunt.registerTask('bar', () => {
        console.log('bar task-');
    })
    /**
     * 失败任务在任务列表中，
     * 如果执行单独的 yarn grunt 命令，那么 bar 任务不会执行。
     * 此时，需要采用强制执行的命令，即 yarn grunt --force
     */
    grunt.registerTask('default', ['foo', 'bad', 'bar'])

    grunt.registerTask('bad-async', function () {
        const done = this.async()

        setTimeout(() => {
            console.log('bad async');
            // 传入一个false实参，即标记为这是一个失败的任务
            done(false)
        }, 1000);
    })
}